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
function pickTemplate(templates, fallback, text) {
  if (!Array.isArray(templates) || templates.length === 0) return fallback;
  const words = text.split(/\s+/).filter(Boolean);
  const index = (text.length + words.length) % templates.length;
  return templates[index];
}

export function buildContextualLocalFallback(text, score, stage) {
  const lower = text.toLowerCase();
  const normalized = lower.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isHeavy = (score ?? 0) <= -3 || (stage ?? 0) <= -1;
  const isLight = (score ?? 0) >= 2 || (stage ?? 0) >= 1;

  if (/suicid|me matar|nao quero viver|não quero viver|acabar com tudo|me machucar/.test(normalized)) {
    return pickTemplate([
      'Fico muito preocupado(a) com o que você está sentindo agora. Por favor, ligue para o CVV: 188 (24h, gratuito) e fique perto de alguém de confiança neste momento.',
      'Eu quero que você saiba que isso não precisa ser enfrentado sozinho(a). Se estiver muito pesado, procure o CVV 188 agora e peça companhia para essa sensação.'
    ], 'Fico muito preocupado(a) com o que você está sentindo agora. Por favor, ligue para o CVV: 188 (24h, gratuito). Você não precisa passar por isso sozinho(a), e há pessoas prontas para te ouvir agora mesmo.', text);
  }

  if (/cachorro|cao|cão|gato|gatinho|pet|animal|veterinari/.test(normalized)) {
    if (/doent|mal|morreu|internad|triste/.test(normalized)) {
      return pickTemplate([
        'Sinto muito pelo seu pet. Sei o quanto isso pode doer, porque esses laços são verdadeiros e cheios de carinho.',
        'Essa situação com o seu pet parece muito pesada. Eu fico aqui torcendo por ele e por você, com muita calma e carinho.'
      ], 'Sinto muito pelo seu pet. Sei o quanto os nossos animais de estimação são parte da nossa família e como dói ver eles doentes ou sofrendo. Estou torcendo muito por ele aqui.', text);
    }
    return pickTemplate([
      'Os pets têm um jeito muito especial de entrar no nosso coração. Me conta mais sobre esse momento com ele, porque parece importante para você.',
      'Parece que esse pet trouxe uma emoção muito forte pra você. Eu gosto de ouvir sobre esses vínculos tão sinceros.'
    ], 'Nossos pets trazem um amor tão puro para a nossa vida! Me conta mais sobre o que aconteceu com ele hoje.', text);
  }

  if (/trabalh|emprego|chefe|reuniao|reunião|demiss|meta|servico|serviço|trampo/.test(normalized)) {
    if (/cansad|estressad|pressao|pressão|horrivel|horrível|ruim|muito/.test(normalized) || isHeavy) {
      return pickTemplate([
        'Parece que o seu trabalho está te deixando bem cansado(a) e isso faz sentido. Talvez seja hora de respirar fundo e dar um espaço para você mesmo(a).',
        'Essa pressão no trabalho parece realmente pesada. Você não precisa carregar tudo de uma vez; talvez seja bom parar por um instante e cuidar de si.'
      ], 'O ambiente de trabalho pode ser extremamente desgastante quando a pressão acumula. Lembre-se de dar uma pausa e respirar — seu bem-estar vem antes de qualquer demanda profissional.', text);
    }
    return pickTemplate([
      'O trabalho ocupa um espaço grande na nossa vida, e isso faz com que a gente sinta cada detalhe. Como você tem estado com essa rotina ultimamente?',
      'Parece que o tema do trabalho esteve presente no seu dia. Eu fico aqui ouvindo tudo com calma e carinho.'
    ], 'O trabalho ocupa uma parte tão grande dos nossos dias. Como você tem lidado com essa rotina ultimamente?', text);
  }

  if (/prova|estud|faculdade|escola|nota|tcc|curso|passar/.test(normalized)) {
    if (/ansios|medo|ruim|dificil|difícil|pesad/.test(normalized) || isHeavy) {
      return pickTemplate([
        'Essa cobrança de estudar e se preparar costuma pesar mesmo. Você está fazendo o melhor que consegue, e isso merece respeito.',
        'Quando a pressão da prova ou dos estudos bate forte, o peito fica apertado. Vá devagar e lembre-se de que um passo por vez já ajuda.'
      ], 'A rotina de estudos e a cobrança por notas costumam dar um nó no peito. Confie no processo e vá um passo de cada vez; você está dando o seu melhor.', text);
    }
    return pickTemplate([
      'Estudar e se dedicar exige bastante energia. Eu fico torcendo para que você consiga chegar onde quer, com calma e persistência.',
      'Parece que essa questão de estudo tem estado muito presente. Estou aqui torcendo por você e pela sua caminhada.'
    ], 'Estudar e se dedicar exige bastante energia. Fico na torcida para que você consiga alcançar seus objetivos!', text);
  }

  if (/mae|mãe|pai|irma|irmã|irmão|familia|família|parente/.test(normalized)) {
    return pickTemplate([
      'As relações com a família mexem profundamente com a gente. Parece que isso deixou algo importante em você, e eu estou aqui para ouvir.',
      'Esses assuntos familiares costumam tocar fundo. Se quiser, pode me contar o que aconteceu em casa.'
    ], 'As relações com nossa família mexem muito com nossos sentimentos. Quer desabafar mais sobre o que aconteceu em casa?', text);
  }

  if (/namorad|marido|esposa|ex|crush|relacionamento|briga|termin/.test(normalized)) {
    return pickTemplate([
      'Assuntos do coração mexem profundamente com a gente. Quando a relação fica tensa, o peito realmente sente isso.',
      'Essas questões afetivas costumam ser delicadas e pesadas. Eu estou aqui com você, sem julgamentos, pra ouvir o que quiser compartilhar.'
    ], 'Assuntos do coração mexem profundamente com a gente. Quando coisas acontecem na relação, o peito fica mexido mesmo. Estou aqui para te ouvir.', text);
  }

  if (/doenc|doença|dor|medico|médico|hospital|remedio|remédio/.test(normalized)) {
    return pickTemplate([
      'Cuidar da saúde exige paciência e carinho consigo mesmo(a). Espero de coração que você consiga se sentir melhor logo.',
      'Quando a saúde entra em cena, o corpo e a mente pedem cuidado. Eu espero que você encontre um pouco de descanso e alívio hoje.'
    ], 'Cuidar da saúde exige paciência e carinho consigo mesmo(a). Espero de coração que você se sinta melhor logo.', text);
  }

  if (/triste|chorando|choro|chorei/.test(normalized) || (score ?? 0) <= -4) {
    return pickTemplate([
      'Acolho sua tristeza com carinho. Fique à vontade para colocar tudo pra fora, porque esse sentimento é legítimo e merece espaço.',
      'Parece que o seu coração está bem pesado hoje. Eu estou aqui, junto com você, sem pressa e sem julgamento.'
    ], 'Acolho sua tristeza com carinho. Fique à vontade para colocar tudo pra fora — seu sentimento é totalmente legítimo.', text);
  }

  if (/cansad|exaust|sem energia|esgotad/.test(normalized) || isHeavy) {
    return pickTemplate([
      'Esse cansaço parece ser bem real, e ele merece cuidado. Talvez seja um bom dia para diminuir a carga e se acolher.',
      'Quando a energia some, o corpo pede pausa. Você não precisa se cobrar tanto hoje; descansar também é importante.'
    ], 'Esse cansaço físico e mental é um sinal do seu corpo pedindo uma pausa. Não se cobre tanto hoje, você merece descansar.', text);
  }

  if (/raiva|irritad|bravo|nervos|furi/.test(normalized)) {
    return pickTemplate([
      'Acolho sua tristeza com carinho. Fique à vontade para colocar tudo pra fora, porque esse sentimento é legítimo e merece espaço.',
      'Parece que o seu coração está bem pesado hoje. Eu estou aqui, junto com você, sem pressa e sem julgamento.'
    ], 'Acolho sua tristeza com carinho. Fique à vontade para colocar tudo pra fora — seu sentimento é totalmente legítimo.', text);
  }

  if (/raiva|irritad|bravo|nervos|furi/.test(normalized)) {
    return pickTemplate([
      'Soltar a frustração faz sentido quando a gente sente isso. Estou aqui escutando tudo sem nenhum julgamento.',
      'Quando a irritação vem forte, o peito fica apertado. Você pode me contar o que aconteceu, que eu fico com você nesse momento.'
    ], 'Soltar a frustração é fundamental para aliviar o peito. Estou aqui escutando tudo sem nenhum julgamento.', text);
  }

  if (/feliz|alegre|animad|otimo|ótimo|maravilhos|incrivel|incrível|consegui|venci/.test(normalized) || isLight) {
    return pickTemplate([
      'Que alegria ver você comemorando esse momento. Parece que algo bom realmente ganhou espaço no seu coração.',
      'É bonito ver você assim, mais leve e contente. Eu fico feliz por você e por essa sensação boa.'
    ], 'Que alegria ver você celebrando esse momento! Fico muito feliz por essa conquista e por ver você radiante.', text);
  }

  return pickTemplate([
    'Obrigada por compartilhar isso comigo. Eu estou ouvindo com atenção e fico aqui com você nesse momento.',
    'Parece que você quis me dizer algo importante hoje. Eu estou acompanhando tudo com carinho e calma.'
  ], 'Obrigado(a) por compartilhar esse momento comigo. Estou acompanhando com atenção tudo o que você me conta.', text);
}

function getContextualLocalFallback(text, score, stage) {
  return buildContextualLocalFallback(text, score, stage);
}

export const COMPANION_DATA = {
  flower: { name: 'A Flor', icon: '🌻' },
  sun:    { name: 'O Sol',  icon: '☀️' },
  emoji:  { name: 'O Emoji', icon: '🫥' }
};
