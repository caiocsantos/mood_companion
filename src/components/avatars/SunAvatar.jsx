import React from 'react';
import { getSunVisualState } from './sunVisualState';

export default function SunAvatar({ stage, size = 180 }) {
  const visualState = getSunVisualState(stage);
  
  // Debug: Log do stage sendo recebido
  React.useEffect(() => {
    console.log(`[SunAvatar] Stage recebido: ${stage}, VisualState:`, visualState);
  }, [stage, visualState]);

  return (
    <div
      className="sun-avatar-wrapper"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      <div
        className="sun-warm-halo"
        style={{
          opacity: visualState.haloOpacity,
          transform: `scale(${0.85 + visualState.rayOpacity * 0.15})`
        }}
      />

      <svg
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="sun-idle-container"
      >
        <defs>
          <radialGradient id="sunCoreGrad" cx="40%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor={visualState.coreEnd} />
            <stop offset="100%" stopColor={visualState.coreStart} />
          </radialGradient>

          <filter id="softSunShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#475569" floodOpacity="0.16" />
          </filter>

          <filter id="sunGlow">
            <feGaussianBlur in="SourceGraphic" stdDeviation={visualState.rayOpacity * 3} />
          </filter>
        </defs>

        <g className="sun-animated-body" filter="url(#softSunShadow)">
          {/* Raios - aparecem apenas quando radiante (estado positivo) */}
          <g className="sun-rays" opacity={visualState.rayOpacity} filter="url(#sunGlow)">
            {/* Raios principais (8 direções) */}
            <rect x="145" y="20" width="10" height="50" rx="5" fill={visualState.coreStart} opacity="0.85" />
            <rect x="145" y="230" width="10" height="50" rx="5" fill={visualState.coreStart} opacity="0.85" />
            <rect x="20" y="145" width="50" height="10" rx="5" fill={visualState.coreStart} opacity="0.85" />
            <rect x="230" y="145" width="50" height="10" rx="5" fill={visualState.coreStart} opacity="0.85" />

            {/* Raios diagonais */}
            <g transform="rotate(45 150 150)">
              <rect x="145" y="20" width="10" height="50" rx="5" fill={visualState.coreStart} opacity="0.7" />
              <rect x="145" y="230" width="10" height="50" rx="5" fill={visualState.coreStart} opacity="0.7" />
            </g>
          </g>

          {/* Núcleo principal - nuvem/sol com transformações */}
          <g transform={`translate(150, 150) scale(${visualState.coreScale})`} className="sun-core-group">
            {/* Forma de nuvem que se transforma em sol conforme fica mais feliz */}
            <ellipse cx="0" cy="8" rx="50" ry="38" fill={visualState.coreStart} opacity="0.9" />
            <ellipse cx="-32" cy="-8" rx="24" ry="28" fill={visualState.coreStart} opacity="0.9" />
            <ellipse cx="32" cy="-8" rx="24" ry="28" fill={visualState.coreStart} opacity="0.9" />

            {/* Detalhes internos - raios suaves que crescem quando feliz */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <g key={i} transform={`rotate(${deg})`} opacity={visualState.rayOpacity * 0.6}>
                <ellipse
                  cx="0"
                  cy={-42 + visualState.rayOpacity * 8}
                  rx={5 + visualState.rayOpacity * 4}
                  ry={12 + visualState.rayOpacity * 10}
                  fill={visualState.coreEnd}
                  opacity={0.5}
                />
              </g>
            ))}

            {/* Círculo central com gradiente - fica mais brilhante quando feliz */}
            <circle
              cx="0"
              cy="0"
              r={32 + visualState.rayOpacity * 8}
              fill="url(#sunCoreGrad)"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="1"
            />

            {/* Brilho interno quando muito positivo */}
            <circle
              cx="-8"
              cy="-8"
              r={12 + visualState.sparkleOpacity * 6}
              fill="#ffffff"
              opacity={visualState.sparkleOpacity * 0.5}
            />

            {/* Expressão facial animada */}
            <g className="sun-face" transform={`translate(0 ${visualState.faceY})`}>
              {/* Olhos */}
              <path
                d="M -14 -6 Q -9 -13 -4 -6"
                stroke={visualState.eyeColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                transform={`rotate(${visualState.eyeTilt} -9 -6)`}
              />
              <path
                d="M 4 -6 Q 9 -13 14 -6"
                stroke={visualState.eyeColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
                transform={`rotate(${-visualState.eyeTilt} 9 -6)`}
              />

              {/* Boca - expressão principal do estado emocional */}
              <path
                d={visualState.faceExpression === 'sad'
                  ? 'M -9 6 Q 0 0 9 6'
                  : visualState.faceExpression === 'joy'
                    ? 'M -9 4 Q 0 16 9 4'
                    : 'M -7 6 Q 0 12 7 6'}
                stroke={visualState.eyeColor}
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                transform={`scale(1 ${visualState.mouthCurve})`}
              />
            </g>

            {/* Sparkles quando muito feliz */}
            <g opacity={visualState.sparkleOpacity}>
              <circle cx="-24" cy="-28" r="2.5" fill={visualState.coreEnd} />
              <circle cx="24" cy="-24" r="2.5" fill={visualState.coreEnd} />
              <circle cx="-22" cy="32" r="2" fill={visualState.coreEnd} />
              <circle cx="28" cy="28" r="2" fill={visualState.coreEnd} />
            </g>
          </g>

          {/* Nuvens escuras - aparecem quando triste */}
          <g opacity={visualState.cloudsOpacity}>
            {/* Nuvem principal - fica mais opaca quando triste */}
            <path
              d="M 70 110 Q 100 85 140 95 Q 180 75 210 105 Q 240 115 235 155 Q 210 180 170 175 Q 110 195 75 165 Z"
              fill={visualState.coreStart}
              opacity="0.8"
            />
            {/* Nuvem secundária */}
            <path
              d="M 90 135 Q 125 115 165 130 Q 205 115 235 145 Q 260 170 230 200 Q 160 215 95 175 Z"
              fill={visualState.coreEnd}
              opacity="0.7"
            />
          </g>

          {/* Chuva - quando muito triste */}
          <g opacity={visualState.rainOpacity}>
            <line x1="110" y1="185" x2="100" y2="225" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="160" y1="195" x2="150" y2="235" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="210" y1="185" x2="200" y2="225" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
