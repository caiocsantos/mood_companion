export function cubicBezier(t, p1x, p1y, p2x, p2y) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleCurveX = (x) => ((ax * x + bx) * x + cx) * x;
  const sampleCurveY = (x) => ((ay * x + by) * x + cy) * x;
  const sampleCurveDerivativeX = (x) => (3 * ax * x + 2 * bx) * x + cx;

  let x = t;
  for (let i = 0; i < 8; i += 1) {
    const currentX = sampleCurveX(x) - t;
    if (Math.abs(currentX) < 1e-6) break;
    const derivative = sampleCurveDerivativeX(x);
    if (Math.abs(derivative) < 1e-6) break;
    x -= currentX / derivative;
  }

  return sampleCurveY(x);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function mixNumber(a, b, amount) {
  return a + (b - a) * amount;
}

function mixColor(startHex, endHex, amount) {
  const toRgb = (hex) => {
    const normalized = hex.replace('#', '');
    const full = normalized.length === 3
      ? normalized.split('').map((char) => char + char).join('')
      : normalized;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16)
    ];
  };

  const start = toRgb(startHex);
  const end = toRgb(endHex);
  const mixRgb = start.map((value, index) => Math.round(mixNumber(value, end[index], amount)));
  return `#${mixRgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

export function getSunVisualState(stage = 0) {
  const clampedStage = clamp(Number(stage) || 0, -2, 2);
  const normalized = (clampedStage + 2) / 4;
  const eased = cubicBezier(normalized, 0.16, 0.84, 0.24, 1);

  const negative = {
    rayOpacity: 0.0,
    petalsRotation: 0,
    coreScale: 0.85,
    faceY: 6,
    eyeTilt: -6,
    mouthCurve: 0.65,
    coreStart: '#64748b',
    coreEnd: '#475569',
    eyeColor: '#1e293b',
    cloudsOpacity: 0.92,
    rainOpacity: 0.75,
    sparkleOpacity: 0.0,
    haloOpacity: 0.08,
    faceExpression: 'sad'
  };

  const neutral = {
    rayOpacity: 0.0,
    petalsRotation: 0,
    coreScale: 1.0,
    faceY: 0,
    eyeTilt: 0,
    mouthCurve: 1,
    coreStart: '#cbd5e1',
    coreEnd: '#94a3b8',
    eyeColor: '#475569',
    cloudsOpacity: 0.35,
    rainOpacity: 0.0,
    sparkleOpacity: 0.0,
    haloOpacity: 0.16,
    faceExpression: 'calm'
  };

  const positive = {
    rayOpacity: 0.95,
    petalsRotation: 8,
    coreScale: 1.12,
    faceY: -4,
    eyeTilt: 5,
    mouthCurve: 1.28,
    coreStart: '#fef08a',
    coreEnd: '#fbbf24',
    eyeColor: '#78350f',
    cloudsOpacity: 0.0,
    rainOpacity: 0.0,
    sparkleOpacity: 0.8,
    haloOpacity: 0.32,
    faceExpression: 'joy'
  };

  return {
    rayOpacity: mixNumber(negative.rayOpacity, positive.rayOpacity, eased),
    petalsRotation: mixNumber(negative.petalsRotation, positive.petalsRotation, eased),
    coreScale: mixNumber(negative.coreScale, positive.coreScale, eased),
    faceY: mixNumber(negative.faceY, positive.faceY, eased),
    eyeTilt: mixNumber(negative.eyeTilt, positive.eyeTilt, eased),
    mouthCurve: mixNumber(negative.mouthCurve, positive.mouthCurve, eased),
    coreStart: mixColor(negative.coreStart, positive.coreStart, eased),
    coreEnd: mixColor(negative.coreEnd, positive.coreEnd, eased),
    eyeColor: mixColor(negative.eyeColor, positive.eyeColor, eased),
    cloudsOpacity: mixNumber(negative.cloudsOpacity, positive.cloudsOpacity, eased),
    rainOpacity: mixNumber(negative.rainOpacity, positive.rainOpacity, eased),
    sparkleOpacity: mixNumber(negative.sparkleOpacity, positive.sparkleOpacity, eased),
    haloOpacity: mixNumber(negative.haloOpacity, positive.haloOpacity, eased),
    faceExpression: clampedStage < 0 ? 'sad' : clampedStage > 0 ? 'joy' : 'calm',
    stageLabel: clampedStage < -1 ? 'tempestuoso' : clampedStage > 1 ? 'radiante' : 'nublado'
  };
}
