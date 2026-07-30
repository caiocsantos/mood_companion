/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Context-Aware Empathetic AI Companion Service
 * ═══════════════════════════════════════════════════════════════════════════════
 * Responde respeitando estritamente o CONTEXTO trazido pelo usuário.
 * 1. Utiliza a API REST do Gemini 2.0 Flash com histórico de conversa.
 * 2. Fallback local inteligente com extração de tópicos contextuais.
 */

const CONTEXT_SYSTEM_PROMPT = `Você é o MoodCompanion, um companheiro emocional empático, atencioso e afetuoso dentro de um diário visual interativo.

REGRAS OBRIGATÓRIAS DE CONTEXTO:
1. Você DEVE obrigatoriamente fazer referência explícita e direta ao ASSUNTO ESPECÍFICO mencionado pelo usuário (exemplo: se falou sobre cachorro/gato/pet, sobre o chefe/trabalho, sobre prova/estudo, sobre família, saúde, briga, viagem, etc.).
2. Nunca responda de forma genérica ou com respostas vazias como "Entendo seu dia". Demonstre que você realmente leu e compreendeu a situação específica.
3. Mantenha a resposta entre 2 e 3 frases curtas e calorosas em português do Brasil.
4. Nunca use saudações impessoais ("Como posso ajudar?") nem linguagem clínica/médica.
5. Se for mencionado risco de vida/automutilação, oriente acolhedoramente o ligar para o CVV 188.`;

// Histórico de conversa mantido em memória
let chatHistory = [];

/**
 * Gera uma resposta contextual empática para o usuário.
 * @param {string} userMessage - Mensagem enviada pelo usuário
 * @param {number} currentScore - Score atual (-5 a +5)
 * @param {number} stage - Estágio visual (-2 a +2)
 * @returns {Promise<string>} Resposta textual empática
 */
export async function getAIResponse(userMessage, currentScore, stage) {
  if (!userMessage || typeof userMessage !== 'string') {
    return 'Estou aqui com você. Pode me contar mais sobre o que está sentindo?';
  }

  try {
    const geminiResponse = await fetchGeminiContextualResponse(userMessage);
    if (geminiResponse) {
      return geminiResponse;
    }
  } catch (err) {
    console.warn('[AICompanion] Gemini backend error, fallback local:', err);
  }

  return getContextualLocalFallback(userMessage, currentScore, stage);
}

/**
 * Chamada à API REST do Gemini 2.0 Flash para geração conversacional contextualizada.
 */
async function fetchGeminiContextualResponse(userMessage) {
  // Atualiza histórico local
  chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

  // Mantém no máximo as últimas 12 interações
  if (chatHistory.length > 12) {
    chatHistory = chatHistory.slice(-12);
  }

  const payload = {
    system_instruction: {
      parts: [{ text: CONTEXT_SYSTEM_PROMPT }]
    },
    contents: chatHistory,
    generationConfig: {
      maxOutputTokens: 150,
      temperature: 0.7,
      topP: 0.9
    }
  };

  const response = await fetch('/api/respond', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatHistory, userMessage })
  });

  if (!response.ok) return null;

  const data = await response.json();
  const text = data?.text?.trim();

  if (text) {
    chatHistory.push({ role: 'model', parts: [{ text }] });
    return text;
  }

  return null;
}

/**
 * Limpa o histórico de conversa.
 */
export function resetConversation() {
  chatHistory = [];
}

/**
 * Motor de Fallback Local baseado em Extração de Tópicos e Contextos Específicos.
 */
function getContextualLocalFallback(text, score, stage) {
  const lower = text.toLowerCase();

  // Crise
  if (/suicid|me matar|não quero viver|acabar com tudo|me machucar/.test(lower)) {
    return 'Fico muito preocupado(a) com o que você está sentindo agora. Por favor, ligue para o CVV: 188 (24h, gratuito). Você não precisa passar por isso sozinho(a), e há pessoas prontas para te ouvir agora mesmo.';
  }

  // Pet / Animais
  if (/cachorro|cão|gato|gatinho|pet|animal|veterinári/.test(lower)) {
    if (/doent|mal|morreu|internad|triste/.test(lower)) {
      return 'Sinto muito pelo seu pet. Sei o quanto os nossos animais de estimação são parte da nossa família e como dói ver eles jururu ou doentes. Estou torcendo muito por ele aqui.';
    }
    return 'Nossos pets trazem um amor tão puro para a nossa vida! Me conta mais sobre o que aconteceu com ele hoje.';
  }

  // Trabalho / Emprego / Chefe
  if (/trabalh|emprego|chefe|reunião|demiss|meta|serviço|trampo/.test(lower)) {
    if (/cansad|estressad|pressão|horrível|ruim|muito/.test(lower)) {
      return 'O ambiente de trabalho pode ser extremamente desgastante quando a pressão acumula. Lembre-se de dar uma pausa e respirar — seu bem-estar vem antes de qualquer demanda profissional.';
    }
    return 'O trabalho ocupa uma parte tão grande dos nossos dias. Como você tem lidado com essa rotina ultimamente?';
  }

  // Estudos / Prova / Faculdade / Escola
  if (/prova|estud|faculdade|escola|nota|tcc|curso|passar/.test(lower)) {
    if (/ansios|medo|ruim|difícil|pesad/.test(lower)) {
      return 'A rotina de estudos e a cobrança por notas costumam dar um nó no peito. Confie no processo e vá um passo de cada vez; você está dando o seu melhor.';
    }
    return 'Estudar e se dedicar exige bastante energia. Fico na torcida para que você consiga alcançar seus objetivos!';
  }

  // Família / Mão / Pai / Irmão
  if (/mãe|mae|pai|irmã|irmão|família|familia|parente/.test(lower)) {
    return 'As relações com nossa família mexem muito com nossos sentimentos. Quer desabafar mais sobre o que aconteceu em casa?';
  }

  // Relacionamento / Namorado(a) / Ex
  if (/namorad|marido|esposa|ex|crush|relacionamento|briga|termin/.test(lower)) {
    return 'Assuntos do coração mexem profundamente com a gente. Quando coisas acontecem na relação, o peito fica mexido mesmo. Estou aqui para te ouvir.';
  }

  // Saúde / Doença / Dor
  if (/doenç|doença|dor|médico|medico|hospital|remédio|remedio/.test(lower)) {
    return 'Cuidar da saúde exige paciência e carinho consigo mesmo(a). Espero de coração que você se sinta melhor logo.';
  }

  // Cansaço geral
  if (/cansad|exaust|sem energia|esgotad/.test(lower)) {
    return 'Esse cansaço físico e mental é um sinal do seu corpo pedindo uma pausa. Não se cobre tanto hoje, você merece descansar.';
  }

  // Tristeza geral
  if (/triste|chorando|choro|chorei/.test(lower)) {
    return 'Acolho sua tristeza com carinho. Fique à vontade para colocar tudo pra fora — seu sentimento é totalmente legítimo.';
  }

  // Raiva geral
  if (/raiva|irritad|bravo|nervos|furi/.test(lower)) {
    return 'Soltar a frustração é fundamental para aliviar o peito. Estou aqui escutando tudo sem nenhum julgamento.';
  }

  // Felicidade geral
  if (/feliz|alegre|animad|ótimo|maravilhos|incrível|consegui|venci/.test(lower)) {
    return 'Que alegria ver você celebrando esse momento! Fico muito feliz por essa conquista e por ver você radiante.';
  }

  // Genérico
  return 'Obrigado(a) por compartilhar esse momento comigo. Estou acompanhando com atenção tudo o que você me conta.';
}

export const COMPANION_DATA = {
  flower: { name: 'A Flor', icon: '🌻' },
  sun:    { name: 'O Sol',  icon: '☀️' },
  emoji:  { name: 'O Emoji', icon: '🫥' }
};
