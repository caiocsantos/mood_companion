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

export function getFlowerVisualState(stage = 0) {
  const clampedStage = clamp(Number(stage) || 0, -2, 2);
  const normalized = (clampedStage + 2) / 4;
  const eased = cubicBezier(normalized, 0.16, 0.84, 0.24, 1);

  const negative = {
    bloomScale: 0.82,
    petalOpen: 0.66,
    stemLean: -7,
    faceY: 4,
    eyeTilt: -5,
    mouthCurve: 0.72,
    petalStart: '#fdf6f6',
    petalEnd: '#e7cfd6',
    centerStart: '#8cbfae',
    centerEnd: '#5a8f7a',
    stemStart: '#4d8d64',
    stemEnd: '#2f5d47',
    haloOpacity: 0.18,
    faceExpression: 'sad'
  };

  const neutral = {
    bloomScale: 1,
    petalOpen: 1,
    stemLean: 0,
    faceY: 0,
    eyeTilt: 0,
    mouthCurve: 1,
    petalStart: '#fefefe',
    petalEnd: '#f2dce2',
    centerStart: '#a3d9c9',
    centerEnd: '#76b8a5',
    stemStart: '#529471',
    stemEnd: '#326349',
    haloOpacity: 0.28,
    faceExpression: 'calm'
  };

  const positive = {
    bloomScale: 1.12,
    petalOpen: 1.24,
    stemLean: 6,
    faceY: -3,
    eyeTilt: 4,
    mouthCurve: 1.3,
    petalStart: '#fff7f7',
    petalEnd: '#f5dfe6',
    centerStart: '#b7f0dd',
    centerEnd: '#7ec1a1',
    stemStart: '#6db58c',
    stemEnd: '#3a7c5c',
    haloOpacity: 0.36,
    faceExpression: 'joy'
  };

  return {
    bloomScale: mixNumber(negative.bloomScale, positive.bloomScale, eased),
    petalOpen: mixNumber(negative.petalOpen, positive.petalOpen, eased),
    stemLean: mixNumber(negative.stemLean, positive.stemLean, eased),
    faceY: mixNumber(negative.faceY, positive.faceY, eased),
    eyeTilt: mixNumber(negative.eyeTilt, positive.eyeTilt, eased),
    mouthCurve: mixNumber(negative.mouthCurve, positive.mouthCurve, eased),
    petalStart: mixColor(negative.petalStart, positive.petalStart, eased),
    petalEnd: mixColor(negative.petalEnd, positive.petalEnd, eased),
    centerStart: mixColor(negative.centerStart, positive.centerStart, eased),
    centerEnd: mixColor(negative.centerEnd, positive.centerEnd, eased),
    stemStart: mixColor(negative.stemStart, positive.stemStart, eased),
    stemEnd: mixColor(negative.stemEnd, positive.stemEnd, eased),
    haloOpacity: mixNumber(negative.haloOpacity, positive.haloOpacity, eased),
    faceExpression: clampedStage < 0 ? 'sad' : clampedStage > 0 ? 'joy' : 'calm',
    stageLabel: clampedStage < -1 ? 'murcha' : clampedStage > 1 ? 'florindo' : 'equilibrada'
  };
}
