/**
 * Sentiment Engine & Companion State Logic for MoodCompanion
 * Analyzes tone, manages cumulative score (-5 to +5), maps to 5 visual stages,
 * and generates warm, empathetic active-listener responses in Portuguese.
 */

// Keyphrase Dictionaries for Lightweight Portuguese NLP Sentiment Analysis
const POSITIVE_KEYWORDS = [
  'feliz', 'alegria', 'ótimo', 'otimo', 'excelente', 'amor', 'amando', 'consegui', 'venci',
  'paz', 'tranquilo', 'tranquila', 'aliviado', 'aliviada', 'orgulho', 'orgulhoso', 'orgulhosa',
  'lindo', 'linda', 'gratidão', 'grato', 'grata', 'esperança', 'sorriso', 'sorrir', 'bom', 'boa',
  'bem', 'maravilhoso', 'maravilhosa', 'radiante', 'festa', 'comemorar', 'superar', 'conquista',
  'obrigado', 'obrigada', 'abraço', 'carinho', 'amigo', 'amiga', 'sucesso', 'animado', 'animada'
];

const NEGATIVE_KEYWORDS = [
  'triste', 'tristeza', 'chateado', 'chateada', 'cansado', 'cansada', 'exausto', 'exausta',
  'raiva', 'ódio', 'odio', 'horrível', 'horrivel', 'ruim', 'péssimo', 'pessimo', 'dor', 'doendo',
  'medo', 'ansioso', 'ansiosa', 'ansiedade', 'solidão', 'solitário', 'solitária', 'sozinho', 'sozinha',
  'perdi', 'falhei', 'chorando', 'choro', 'desespero', 'angústia', 'angustia', 'estresse', 'estressado',
  'estressada', 'inseguro', 'insegura', 'fracasso', 'esgotado', 'esgotada', 'pesado', 'pesada', 'culpa'
];

const INTENSIFIERS = ['muito', 'bastante', 'demais', 'extremamente', 'completamente', 'tão', 'tao', 'super'];

/**
 * Classifies a user input message into sentiment score delta (-1.5 to +1.5).
 */
export function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') return { scoreDelta: 0, tone: 'neutral' };

  const lower = text.toLowerCase();
  const words = lower.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").split(/\s+/);

  let posCount = 0;
  let negCount = 0;
  let hasIntensifier = false;

  words.forEach((word) => {
    if (POSITIVE_KEYWORDS.includes(word)) posCount++;
    if (NEGATIVE_KEYWORDS.includes(word)) negCount++;
    if (INTENSIFIERS.includes(word)) hasIntensifier = true;
  });

  // Calculate raw tone
  let delta = 0;
  if (posCount > negCount) {
    delta = 1.0;
    if (posCount > 2 || hasIntensifier) delta = 1.5;
  } else if (negCount > posCount) {
    delta = -1.0;
    if (negCount > 2 || hasIntensifier) delta = -1.5;
  } else {
    delta = 0;
  }

  const tone = delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';
  return { scoreDelta: delta, tone };
}

/**
 * Maps a cumulative score (-5.0 to +5.0) to one of the 5 visual stages (-2 to +2).
 */
export function getStageFromScore(score) {
  if (score <= -3) return -2;
  if (score <= -1) return -1;
  if (score < 1) return 0;
  if (score <= 2) return 1;
  return 2;
}

/**
 * Metadata & Descriptions for each visual stage across the 3 companions.
 */
export const COMPANION_DATA = {
  flower: {
    name: 'A Flor',
    icon: '🌻',
    description: 'Metáfora de cultivo, paciência e florescimento interior.',
    stages: {
      '-2': {
        name: 'O Cardo das Sombras',
        subtitle: 'Proteção contra tempestades e espinhos',
        description: 'Sua flor fechou-se em um espinho roxo e denso para se proteger dos sentimentos difíceis. Ela precisa de abrigo e escuta.',
        badgeColor: '#e11d48'
      },
      '-1': {
        name: 'Cabrumm / Murcha',
        subtitle: 'Curvada sob a chuva de sentimentos',
        description: 'Uma suave inclinação para baixo, recebendo gotas frias de chuva. Ela sente o peso do seu dia, mas continua viva.',
        badgeColor: '#38bdf8'
      },
      '0': {
        name: 'O Broto Equilibrado',
        subtitle: 'Paz, serenidade e raízes firmes',
        description: 'Um broto pastel ereto e sereno. Encontra-se em ponto de equilíbrio e abertura tranquila.',
        badgeColor: '#10b981'
      },
      '1': {
        name: 'O Lótus Rosa',
        subtitle: 'Abertura suave e contentamento',
        description: 'Pétalas rosadas desabrochando com um brilho suave de carinho e gratidão pelo seu momento.',
        badgeColor: '#ec4899'
      },
      '2': {
        name: 'O Lótus Luminoso',
        subtitle: 'Plena iluminação e amor radiante',
        description: 'Uma aura dourada radiante e corações brilhantes. Sua flor está em sua máxima vitalidade!',
        badgeColor: '#d97706'
      }
    }
  },
  sun: {
    name: 'O Sol',
    icon: '☀️',
    description: 'Metáfora do clima interno, da atmosfera e do ritmo dos dias.',
    stages: {
      '-2': {
        name: 'Sol Tempestuoso',
        subtitle: 'Relâmpagos e nuvens de tempestade',
        description: 'O sol está oculto por pesadas nuvens de tempestade e relâmpagos. É natural passar por momentos intensos.',
        badgeColor: '#7c3aed'
      },
      '-1': {
        name: 'Sol de Chuva',
        subtitle: 'Gotas suaves entre nuvens cinzas',
        description: 'Nuvens cinzentas e chuva mansa. O clima está nublado, convidando ao descanso e reflexão.',
        badgeColor: '#0284c7'
      },
      '0': {
        name: 'Sol Suave',
        subtitle: 'Luz serena e céu limpo',
        description: 'Um brilho pastel equilibrado, aquecendo o ambiente sem alarde. Temperatura emocional ideal.',
        badgeColor: '#059669'
      },
      '1': {
        name: 'Sol Vibrante',
        subtitle: 'Raios dourados de alegria',
        description: 'O céu se abre totalmente com um sorriso luminoso e caloroso iluminando todo o seu dia.',
        badgeColor: '#ea580c'
      },
      '2': {
        name: 'Sol Radiante & Dourado',
        subtitle: 'Aura mágica de felicidade',
        description: 'Brilho supremo com arcos-íris e claridade dourada! Seu clima interno transborda luz.',
        badgeColor: '#b45309'
      }
    }
  },
  emoji: {
    name: 'O Emoji',
    icon: '🫥',
    description: 'Expressão direta vector/3D da sua energia emocional.',
    stages: {
      '-2': {
        name: 'Explodindo de Frustração',
        subtitle: 'Tensão acentuada e fogo interior',
        description: 'Vapor e chama interior de desabafo. Seu companheiro acolhe toda a sua indignação.',
        badgeColor: '#be123c'
      },
      '-1': {
        name: 'Sensível & Chateado',
        subtitle: 'Olhos marejados e busca por abraço',
        description: 'Lágrimas suaves escorrendo. Ele sente junto com você e quer te dar um espaço seguro.',
        badgeColor: '#2563eb'
      },
      '0': {
        name: 'Neutro & Sereno',
        subtitle: 'Olhar calmo e presença atenta',
        description: 'Tranquilidade e escuta ativa. Pronto para receber o que você quiser compartilhar.',
        badgeColor: '#047857'
      },
      '1': {
        name: 'Sorridente & Leve',
        subtitle: 'Bochechas coradas e entusiasmo',
        description: 'Um sorriso gostoso de alegria genuína ao perceber seu progresso e momentos bons.',
        badgeColor: '#db2777'
      },
      '2': {
        name: 'Radiantemente Apaixonado',
        subtitle: 'Corações nos olhos e felicidade pura',
        description: 'Transbordando amor e gratidão! Seu estado de espírito acende o ambiente.',
        badgeColor: '#c2410c'
      }
    }
  }
};

/**
 * Empathetic AI Response Generator in Portuguese (Active Listening Style).
 */
export function generateEmpatheticResponse(userText, tone, currentScore, stage) {
  const textLower = userText.toLowerCase();

  // Special thematic checks
  if (textLower.includes('cansad') || textLower.includes('exaust') || textLower.includes('dormir')) {
    return "Sinto muito que você esteja se sentindo assim tão esgotado(a). Lembre-se de que descansar é um ato de carinho com você mesmo. Estou aqui segurando esse momento com você.";
  }

  if (textLower.includes('triste') || textLower.includes('chorar') || textLower.includes('doendo')) {
    return "Acolho sua dor com todo o carinho. É completamente legítimo sentir isso, e você não precisa carregar tudo sozinho(a). Aos poucos vamos cuidando do seu jardim interno.";
  }

  if (textLower.includes('raiva') || textLower.includes('odio') || textLower.includes('injusto')) {
    return "Sua frustração faz total sentido. Colocar isso para fora é o primeiro passo para aliviar o peito. Estou aqui escutando tudo sem nenhum julgamento.";
  }

  if (textLower.includes('consegui') || textLower.includes('feliz') || textLower.includes('orgulho') || textLower.includes('venci')) {
    return "Que conquista maravilhosa! Fico radiante em ver você celebrar esse momento. Cada vitória sua nutre imensamente o nosso espaço.";
  }

  if (textLower.includes('obrigad') || textLower.includes('valeu') || textLower.includes('ajudou')) {
    return "Eu que agradeço por confiar em mim para partilhar o seu dia. Cuidar de você é a minha maior alegria!";
  }

  // Stage-aware fallback empathetic responses
  if (tone === 'negative') {
    const negResponses = [
      "Obrigado por compartilhar o que está no seu coração. Estou aqui para te ouvir e guardar o seu sentimento com todo respeito.",
      "Entendo que hoje o dia possa estar pesado. Não há pressa para mudar isso, vamos um passo de cada vez.",
      "É muito corajoso dar nome ao que nos machuca. Seu companheiro absorve esse desabafo para te dar leveza."
    ];
    return negResponses[Math.floor(Math.random() * negResponses.length)];
  }

  if (tone === 'positive') {
    const posResponses = [
      "Saber disso traz uma brisa tão boa para o nosso espaço! Obrigado por compartilhar esse momento de luz.",
      "Que energia gostosa! Sentir sua alegria faz com que nosso companheiro floresça com ainda mais brilho.",
      "Fico muito feliz por você! Momentos como este renovam nossas energias e fortalecem nosso laço."
    ];
    return posResponses[Math.floor(Math.random() * posResponses.length)];
  }

  // Neutral tone
  const neutralResponses = [
    "Estou te ouvindo com atenção. Como você se sente em relação a isso que me contou?",
    "Aprecio você tirar um momento para conversar comigo. Estou sempre aqui para acompanhar seus pensamentos.",
    "Obrigado por registrar seu momento no diário. Cada detalhe ajuda a trazer mais equilíbrio ao seu companheiro."
  ];
  return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
}
