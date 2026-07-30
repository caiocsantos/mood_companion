/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Regra 1 — Local NLP Sentiment Analyzer (PT-BR)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Analisador de sentimento 100% client-side com léxico ponderado em português.
 * Suporta intensificadores, negadores, e retorna score, tone e emoção dominante.
 * Latência: ~0ms. Zero chamadas de API.
 */

// ─── Léxico Ponderado PT-BR ─────────────────────────────────────────────────
// Peso de -3 (muito negativo) a +3 (muito positivo)
const LEXICON = {
  // ── Muito Positivo (+3) ──
  'maravilhoso': 3, 'maravilhosa': 3, 'incrível': 3, 'extraordinário': 3,
  'espetacular': 3, 'fenomenal': 3, 'radiante': 3, 'apaixonado': 3,
  'apaixonada': 3, 'extasiado': 3, 'extasiada': 3, 'eufórico': 3,
  'eufórica': 3, 'sublime': 3, 'perfeito': 3, 'perfeita': 3,

  // ── Positivo (+2) ──
  'feliz': 2, 'alegre': 2, 'contente': 2, 'animado': 2, 'animada': 2,
  'empolgado': 2, 'empolgada': 2, 'orgulhoso': 2, 'orgulhosa': 2,
  'orgulho': 2, 'venci': 2, 'consegui': 2, 'superei': 2, 'conquista': 2,
  'ótimo': 2, 'ótima': 2, 'excelente': 2, 'fantástico': 2, 'fantástica': 2,
  'lindo': 2, 'linda': 2, 'felicidade': 2, 'alegria': 2,

  // ── Levemente Positivo (+1) ──
  'bem': 1, 'bom': 1, 'boa': 1, 'legal': 1, 'bacana': 1, 'tranquilo': 1,
  'tranquila': 1, 'aliviado': 1, 'aliviada': 1, 'grato': 1, 'grata': 1,
  'gratidão': 1, 'esperança': 1, 'sorriso': 1, 'sorrir': 1, 'paz': 1,
  'calmo': 1, 'calma': 1, 'leve': 1, 'leveza': 1, 'carinho': 1,
  'amor': 1, 'amando': 1, 'amigo': 1, 'amiga': 1, 'abraço': 1,
  'sucesso': 1, 'festa': 1, 'comemorar': 1, 'obrigado': 1, 'obrigada': 1,

  // ── Levemente Negativo (-1) ──
  'chateado': -1, 'chateada': -1, 'cansado': -1, 'cansada': -1,
  'preocupado': -1, 'preocupada': -1, 'nervoso': -1, 'nervosa': -1,
  'inseguro': -1, 'insegura': -1, 'confuso': -1, 'confusa': -1,
  'estranho': -1, 'estranha': -1, 'difícil': -1, 'pesado': -1,
  'pesada': -1, 'irritado': -1, 'irritada': -1, 'chato': -1,
  'culpa': -1, 'medo': -1, 'tenso': -1, 'tensa': -1,

  // ── Negativo (-2) ──
  'triste': -2, 'tristeza': -2, 'chorando': -2, 'choro': -2, 'chorei': -2,
  'ansioso': -2, 'ansiosa': -2, 'ansiedade': -2, 'ruim': -2,
  'péssimo': -2, 'péssima': -2, 'horrível': -2, 'terrível': -2,
  'frustrado': -2, 'frustrada': -2, 'solitário': -2, 'solitária': -2,
  'solidão': -2, 'sozinho': -2, 'sozinha': -2, 'angústia': -2,
  'estresse': -2, 'estressado': -2, 'estressada': -2, 'fracasso': -2,
  'esgotado': -2, 'esgotada': -2, 'exausto': -2, 'exausta': -2,

  // ── Muito Negativo (-3) ──
  'desesperado': -3, 'desesperada': -3, 'desespero': -3, 'raiva': -3,
  'ódio': -3, 'odio': -3, 'dor': -3, 'doendo': -3, 'sofrer': -3,
  'sofrimento': -3, 'agonia': -3, 'destruído': -3, 'destruída': -3,
  'arrasado': -3, 'arrasada': -3, 'falhei': -3, 'perdi': -2,
  'perdido': -2, 'perdida': -2
};

// ─── Intensificadores (multiplicam peso por 1.5) ────────────────────────────
const INTENSIFIERS = new Set([
  'muito', 'bastante', 'demais', 'extremamente', 'completamente',
  'super', 'tão', 'totalmente', 'absurdamente', 'incrivelmente',
  'profundamente', 'imensamente'
]);

// ─── Negadores (invertem sinal da próxima palavra) ──────────────────────────
const NEGATORS = new Set([
  'não', 'nao', 'nem', 'nunca', 'jamais', 'nenhum', 'nenhuma',
  'tampouco', 'sem'
]);

// ─── Mapeamento de Score → Emoção Dominante ─────────────────────────────────
const EMOTION_MAP = [
  { min: -5.0, max: -3.0, emotion: 'despair' },
  { min: -3.0, max: -1.5, emotion: 'sadness' },
  { min: -1.5, max: -0.5, emotion: 'worry' },
  { min: -0.5, max:  0.5, emotion: 'neutral' },
  { min:  0.5, max:  1.5, emotion: 'contentment' },
  { min:  1.5, max:  3.0, emotion: 'happiness' },
  { min:  3.0, max:  5.0, emotion: 'joy' }
];

function getEmotionFromScore(score) {
  for (const { min, max, emotion } of EMOTION_MAP) {
    if (score >= min && score < max) return emotion;
  }
  return score >= 3 ? 'joy' : 'despair';
}

// ─── Main Analysis Function ─────────────────────────────────────────────────
/**
 * Analisa sentimento de um texto em português.
 * @param {string} text - Texto do usuário
 * @returns {{ score: number, tone: string, emotion: string, wordCount: number }}
 *   score: -5.0 a +5.0
 *   tone: 'positive' | 'negative' | 'neutral'
 *   emotion: emoção dominante
 */
export function analyzeLocal(text) {
  if (!text || typeof text !== 'string') {
    return { score: 0, tone: 'neutral', emotion: 'neutral', wordCount: 0 };
  }

  const lower = text.toLowerCase();
  const cleaned = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()?¿¡!'"]/g, ' ');
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);

  if (words.length === 0) {
    return { score: 0, tone: 'neutral', emotion: 'neutral', wordCount: 0 };
  }

  let totalWeight = 0;
  let matchedWords = 0;
  let isNegated = false;
  let hasIntensifier = false;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    // Check negators
    if (NEGATORS.has(word)) {
      isNegated = true;
      continue;
    }

    // Check intensifiers
    if (INTENSIFIERS.has(word)) {
      hasIntensifier = true;
      continue;
    }

    // Check lexicon
    if (word in LEXICON) {
      let weight = LEXICON[word];

      // Apply negation (inverts sign)
      if (isNegated) {
        weight = -weight * 0.75; // Negation dampens slightly
        isNegated = false;
      }

      // Apply intensifier (amplifies)
      if (hasIntensifier) {
        weight *= 1.5;
        hasIntensifier = false;
      }

      totalWeight += weight;
      matchedWords++;
    } else {
      // Reset modifiers if word is not in lexicon
      isNegated = false;
      hasIntensifier = false;
    }
  }

  // Normalize: average weight of matched words, clamped to [-5, +5]
  let score;
  if (matchedWords === 0) {
    score = 0;
  } else {
    // Use sum for messages with few emotional words, average for many
    score = matchedWords <= 2 ? totalWeight : totalWeight / Math.sqrt(matchedWords);
    score = Math.max(-5, Math.min(5, score));
  }

  // Round to 1 decimal
  score = Math.round(score * 10) / 10;

  const tone = score > 0.3 ? 'positive' : score < -0.3 ? 'negative' : 'neutral';
  const emotion = getEmotionFromScore(score);

  return { score, tone, emotion, wordCount: words.length };
}

/**
 * Converts a -5..+5 score to the 0..100 EMA scale.
 * -5 → 0, 0 → 50, +5 → 100
 */
export function scoreToEmaScale(score) {
  return Math.round(((score + 5) / 10) * 100);
}

/**
 * Converts a 0..100 EMA value back to -5..+5 score.
 */
export function emaScaleToScore(emaValue) {
  return ((emaValue / 100) * 10) - 5;
}
