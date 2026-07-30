/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Regra 4 — Gemini Classifier REST Service
 * ═══════════════════════════════════════════════════════════════════════════════
 * Faz a chamada REST nativa à API do Gemini Flash (sem dependência de SDK npm).
 * Configurações restritas:
 *   - maxOutputTokens: 15
 *   - temperature: 0.1
 *   - responseMimeType: "application/json"
 *   - System Prompt Estrito: Retorna APENAS {"score": N, "emotion": "X"}
 */

const GEMINI_SYSTEM_PROMPT = `Você é um classificador emocional estrito. Receba um bloco de texto e retorne APENAS um JSON com o sentimento (-5 a 5) e a emoção dominante. Exemplo de resposta: {"score": 3, "emotion": "joy"}. Não adicione saudações ou textos explicativos.`;

/**
 * Classifica um bloco acumulado de mensagens utilizando a API do Gemini Flash via REST.
 * @param {string[]} messagesBatch - Lista de mensagens acumuladas pelo debounce
 * @returns {Promise<{ score: number, emotion: string } | null>}
 */
export async function classifyBatchWithGemini(messagesBatch) {
  if (!messagesBatch || messagesBatch.length === 0) return null;

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
    console.warn('[GeminiClassifier] API key não configurada. Usando apenas análise local.');
    return null;
  }

  // Combina o lote de mensagens em um único bloco de texto
  const textBlock = messagesBatch.map(m => `- ${m}`).join('\n');

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    system_instruction: {
      parts: [
        { text: GEMINI_SYSTEM_PROMPT }
      ]
    },
    contents: [
      {
        role: 'user',
        parts: [
          { text: textBlock }
        ]
      }
    ],
    generationConfig: {
      maxOutputTokens: 15,
      temperature: 0.1,
      responseMimeType: 'application/json'
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`[GeminiClassifier] HTTP error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!rawText) {
      console.warn('[GeminiClassifier] Resposta vazia da API.');
      return null;
    }

    // Parse JSON restrito
    const parsed = JSON.parse(rawText);
    const score = typeof parsed.score === 'number' ? Math.max(-5, Math.min(5, parsed.score)) : 0;
    const emotion = typeof parsed.emotion === 'string' ? parsed.emotion : 'neutral';

    return { score, emotion };
  } catch (err) {
    console.warn('[GeminiClassifier] Falha na requisição Gemini:', err);
    return null;
  }
}
