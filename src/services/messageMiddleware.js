/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Regra 2 — Message Interception Middleware (Front-end)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Camada de interceptação antes do processamento pesado:
 * 1. Filtro Neutro: Mensagens < 3 palavras ou triviais (oi, ok, beleza...) -> score 0
 * 2. Filtro de Emoji: Dicionário chave-valor para emojis -> score instantâneo
 * 3. Debounce (45s): Acumula mensagens e dispara lote para classificação refinada
 */

// ─── Dicionário de Emojis (Score -5 a +5) ────────────────────────────────────
const EMOJI_DICTIONARY = {
  // Positivos / Felizes
  '😀': 2, '😃': 2, '😄': 3, '😁': 3, '😆': 3, '😅': 1, '😂': 2, '🤣': 3,
  '😊': 2, '😇': 2, '🙂': 1, '🙃': 1, '😉': 1, '😌': 2, '😍': 4, '🥰': 4,
  '😘': 3, '😗': 2, '😙': 2, '😚': 2, '😋': 2, '😛': 1, '😜': 2, '🤪': 2,
  '😝': 2, '🤑': 2, '🤗': 3, '🤭': 1, '🥳': 4, '😎': 2, '🤓': 1, '🤩': 4,
  '👍': 1, '👏': 2, '🙌': 3, '🎉': 4, '✨': 3, '💖': 4, '❤️': 4, '💗': 4,
  '🌻': 3, '☀️': 3, '🌈': 4, '💪': 3, '🔥': 3, '⭐': 3, '🌟': 4,

  // Neutros / Expressivos
  '😐': 0, '😑': 0, '😶': 0, '🤔': 0, '🤨': 0, '🧐': 0, '🙄': -1, '😬': -1,
  '😮': 0, '😯': 0, '😲': 0, '😳': -1, '😴': 0, '💤': 0,

  // Negativos / Tristes / Raiva
  '😒': -1, '😞': -2, '😔': -2, '😟': -2, '😕': -1, '🙁': -2, '☹️': -3,
  '😣': -2, '😖': -2, '😫': -3, '😩': -3, '🥺': -2, '😢': -3, '😭': -4,
  '😤': -2, '😠': -3, '😡': -4, '🤬': -5, '🤯': -3, '🥵': -2,
  '🥶': -2, '😱': -4, '😨': -3, '😰': -3, '😥': -2, '😓': -2,
  '💔': -4, '🥀': -3, '🌧️': -2, '⛈️': -3, '🌩️': -3, '⚡': -2, '👎': -1
};

// ─── Palavras Triviais / Neutras ──────────────────────────────────────────────
const TRIVIAL_WORDS = new Set([
  'oi', 'olá', 'ola', 'ok', 'okei', 'okay', 'beleza', 'blz', 'tudo bem',
  'tudo bom', 'sim', 'nao', 'não', 'ah', 'eai', 'e aí', 'vlw', 'valeu',
  'obrigado', 'obrigada', 'tmj', 'certo', 'entendi', 'tchau', 'até', 'ate'
]);

// RegEx para testar se texto contém apenas emojis
const EMOJI_REGEX = /^[\p{Extended_Pictographic}\s]+$/u;

// ─── Debounce Accumulator State ──────────────────────────────────────────────
let pendingMessagesBatch = [];
let debounceTimer = null;
const DEBOUNCE_DELAY_MS = 45000; // 45 segundos

/**
 * Classifica mensagem de entrada aplicando os filtros locais.
 * @param {string} text 
 * @returns {{ isNeutral: boolean, isEmojiOnly: boolean, score: number | null, isSubstantive: boolean }}
 */
export function interceptMessage(text) {
  if (!text || typeof text !== 'string') {
    return { isNeutral: true, isEmojiOnly: false, score: 0, isSubstantive: false };
  }

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const words = lower.split(/\s+/).filter(w => w.length > 0);

  // 1. Filtro de Emoji puro
  if (EMOJI_REGEX.test(trimmed)) {
    let emojiScoreSum = 0;
    let count = 0;

    const symbolMatches = trimmed.match(/\p{Extended_Pictographic}/gu) || [];
    for (const symbol of symbolMatches) {
      if (symbol in EMOJI_DICTIONARY) {
        emojiScoreSum += EMOJI_DICTIONARY[symbol];
        count++;
      }
    }

    const finalScore = count > 0 ? Math.max(-5, Math.min(5, Math.round(emojiScoreSum / count))) : 0;
    return { isNeutral: false, isEmojiOnly: true, score: finalScore, isSubstantive: false };
  }

  // 2. Filtro Neutro (curto < 3 palavras ou palavras triviais)
  const isShort = words.length < 3;
  const isTrivial = TRIVIAL_WORDS.has(lower) || (words.length <= 2 && words.every(w => TRIVIAL_WORDS.has(w)));

  if (isTrivial || (isShort && words.every(w => w.length < 4))) {
    return { isNeutral: true, isEmojiOnly: false, score: 0, isSubstantive: false };
  }

  // 3. Mensagem substantiva (elegível para análise de sentimento local e lote Gemini)
  return { isNeutral: false, isEmojiOnly: false, score: null, isSubstantive: true };
}

/**
 * Agenda o envio de uma mensagem substantiva para a fila de debounce de 45 segundos.
 * @param {string} text - Texto da mensagem
 * @param {function(string[]): void} onFlush - Callback executado com o bloco acumulado após 45s
 */
export function enqueueSubstantiveMessage(text, onFlush) {
  pendingMessagesBatch.push(text);

  // Reinicia o timer de inatividade de 45s
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    if (pendingMessagesBatch.length > 0) {
      const batchToProcess = [...pendingMessagesBatch];
      pendingMessagesBatch = [];
      debounceTimer = null;
      if (onFlush && typeof onFlush === 'function') {
        onFlush(batchToProcess);
      }
    }
  }, DEBOUNCE_DELAY_MS);
}

/**
 * Limpa o timer e lote pendente se necessário.
 */
export function cancelPendingBatch() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  pendingMessagesBatch = [];
}
