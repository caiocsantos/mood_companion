/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Regra 3 — Algoritmo de Suavização Emocional (Exponential Moving Average - EMA)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Mantém o estado emocional do avatar (flor/sol/emoji) em uma escala contínua de 0 a 100.
 * Fórmula: S_t = α * E_t + (1 - α) * S_{t-1}
 * Onde:
 *   - S_t: Novo estado suavizado (0 a 100)
 *   - E_t: Entrada emocional atual convertida para a escala 0 a 100
 *   - S_{t-1}: Estado suavizado anterior
 *   - α (alpha): 0.15 (fator de amortecimento para transição progressiva e suave)
 */

export const ALPHA = 0.15;
export const DEFAULT_EMA_STATE = 50; // 50 representa neutro na escala 0..100

/**
 * Converte um score de -5.0 a +5.0 para a escala de entrada E_t (0 a 100).
 * -5 → 0
 *  0 → 50
 * +5 → 100
 * @param {number} score 
 * @returns {number} E_t (0..100)
 */
export function scoreToInputValue(score) {
  const clamped = Math.max(-5, Math.min(5, score));
  return Math.round(((clamped + 5) / 10) * 100);
}

/**
 * Converte um estado EMA S_t (0 a 100) de volta para o score equivalente (-5.0 a +5.0).
 * 0   → -5.0
 * 50  →  0.0
 * 100 → +5.0
 * @param {number} emaState (0..100)
 * @returns {number} score (-5.0..+5.0)
 */
export function emaToScore(emaState) {
  const clamped = Math.max(0, Math.min(100, emaState));
  const score = ((clamped / 100) * 10) - 5;
  return Math.round(score * 100) / 100;
}

/**
 * Calcula o próximo estado EMA utilizando a fórmula:
 * S_t = α * E_t + (1 - α) * S_{t-1}
 * 
 * @param {number} currentEma - Estado anterior S_{t-1} (0 a 100)
 * @param {number} inputScore - Novo score de entrada (-5 a +5) ou entrada bruta (0 a 100)
 * @param {boolean} isRawValue - Se true, inputScore já está em 0..100. Se false, é -5..+5
 * @returns {number} Novo estado S_t (0 a 100)
 */
export function calculateNextEMA(currentEma, inputScore, isRawValue = false) {
  const E_t = isRawValue ? Math.max(0, Math.min(100, inputScore)) : scoreToInputValue(inputScore);
  const S_prev = typeof currentEma === 'number' && !isNaN(currentEma) ? currentEma : DEFAULT_EMA_STATE;

  const S_next = (ALPHA * E_t) + ((1 - ALPHA) * S_prev);
  return Math.round(S_next * 100) / 100;
}

/**
 * Mapeia o estado EMA S_t (0 a 100) para os 5 estágios visuais do avatar (-2 a +2):
 *   0  .. 20 → -2 (Cardo / Tempestade / Explodindo)
 *  20  .. 40 → -1 (Murcha / Chuva / Sensível)
 *  40  .. 60 →  0 (Broto / Suave / Neutro)
 *  60  .. 80 → +1 (Lótus Rosa / Vibrante / Sorridente)
 *  80 .. 100 → +2 (Lótus Luminoso / Radiante / Apaixonado)
 * 
 * @param {number} emaState (0 a 100)
 * @returns {number} Stage visual (-2, -1, 0, 1, 2)
 */
export function emaToStage(emaState) {
  if (emaState < 20) return -2;
  if (emaState < 40) return -1;
  if (emaState <= 60) return 0;
  if (emaState <= 80) return 1;
  return 2;
}

/**
 * Retorna o rótulo textual e a cor do termômetro baseados no estado EMA (0 a 100).
 * @param {number} emaState (0 a 100)
 */
export function getEmaStatusInfo(emaState) {
  const stage = emaToStage(emaState);
  switch (stage) {
    case -2: return { label: 'Tempestuoso', color: '#7c3aed', stageName: 'Estresse Intenso' };
    case -1: return { label: 'Nublado', color: '#0284c7', stageName: 'Sensível / Murcha' };
    case 0:  return { label: 'Equilibrado', color: '#059669', stageName: 'Neutro / Sereno' };
    case 1:  return { label: 'Acolhedor', color: '#ea580c', stageName: 'Florescendo' };
    case 2:  return { label: 'Radiante', color: '#b45309', stageName: 'Plena Iluminação' };
    default: return { label: 'Equilibrado', color: '#059669', stageName: 'Neutro' };
  }
}
