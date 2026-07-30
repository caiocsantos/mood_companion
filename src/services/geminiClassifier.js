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

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Gemini Classifier Service (proxy para backend seguro).
 * A chave de API permanece no servidor e não é embutida no bundle frontend.
 */

/**
 * Classifica um bloco acumulado de mensagens utilizando o backend.
 * @param {string[]} messagesBatch - Lista de mensagens acumuladas pelo debounce
 * @returns {Promise<{ score: number, emotion: string } | null>}
 */
export async function classifyBatchWithGemini(messagesBatch) {
  if (!messagesBatch || messagesBatch.length === 0) return null;

  try {
    const response = await fetch('/api/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messagesBatch })
    });

    if (!response.ok) {
      console.warn(`[GeminiClassifier] backend error: ${response.status}`);
      return null;
    }

    const parsed = await response.json();
    return parsed;
  } catch (err) {
    console.warn('[GeminiClassifier] Falha ao se conectar ao backend de classificação:', err);
    return null;
  }
}
