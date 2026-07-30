import React from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Pearlescent Flower Avatar (Flor Perolada Serena)
 * ═══════════════════════════════════════════════════════════════════════════════
 * Animações ociosas (Idle Motion Specifications da image_3.png):
 * - Sway (Balanço): 15° a cada 4s (15deg/4s)
 * - Breathing (Respiração): Contração/Expansão rítmica de 5% a cada 2s (5%/2s)
 * - Blink (Piscar): Piscar suave e rápido de 0.2s a cada 10s (0.2s/10s)
 */
export default function FlowerAvatar({ stage, size = 180 }) {
  return (
    <div
      className="flower-avatar-wrapper"
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        position: 'relative'
      }}
    >
      {/* Halo de Brilho Quente de Fundo */}
      <div className="flower-warm-halo" />

      <svg
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flower-idle-container"
      >
        <defs>
          {/* Gradiente Perolado 3D para as Pétalas */}
          <radialGradient id="pearlPetalGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f7e6e8" />
            <stop offset="85%" stopColor="#ebd2d6" />
            <stop offset="100%" stopColor="#d4b5ba" />
          </radialGradient>

          {/* Gradiente para o Miolo/Rosto Sereno */}
          <radialGradient id="flowerCenterGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#a3d9c9" />
            <stop offset="60%" stopColor="#76b8a5" />
            <stop offset="100%" stopColor="#4f9683" />
          </radialGradient>

          {/* Gradiente do Caule Orgânico */}
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#529471" />
            <stop offset="100%" stopColor="#326349" />
          </linearGradient>

          {/* Sombra Suave das Pétalas */}
          <filter id="softFlowerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#8e736a" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Grupo com Animação de Balanço (Sway 15deg/4s) e Respiração (Breathing 5%/2s) */}
        <g className="flower-animated-body" filter="url(#softFlowerShadow)">

          {/* Caule Curvado e Folhas */}
          <g className="flower-stem-group">
            <path
              d="M 150 260 Q 135 195 150 135"
              stroke="url(#stemGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Folha Esquerda */}
            <path
              d="M 146 210 Q 110 195 105 210 Q 125 225 146 215 Z"
              fill="#529471"
            />
            {/* Folha Direita */}
            <path
              d="M 152 185 Q 188 170 195 185 Q 175 200 152 190 Z"
              fill="#437d5e"
            />
          </g>

          {/* Grupo de Pétalas Peroladas em 3D */}
          <g transform="translate(150, 125)" className="flower-head-group">
            {/* 5 Pétalas Peroladas Arredondadas (Estilo 3D Pearlescent da Image 3) */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <g key={i} transform={`rotate(${deg})`}>
                <path
                  d="M 0 -22 C -22 -55, -28 -78, 0 -92 C 28 -78, 22 -55, 0 -22 Z"
                  fill="url(#pearlPetalGrad)"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.5"
                />
                {/* Brilho Especular na Pétala */}
                <ellipse cx="-4" cy="-65" rx="4" ry="12" fill="#ffffff" opacity="0.6" transform="rotate(-10 -4 -65)" />
              </g>
            ))}

            {/* Miolo Esférico Sereno */}
            <circle cx="0" cy="0" r="32" fill="url(#flowerCenterGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

            {/* Olhos e Sorriso Serenos com Animação de Piscar (Blink 0.2s/10s) */}
            <g className="flower-face-eyes">
              {/* Olho Esquerdo */}
              <path
                d="M -14 -4 Q -9 -11 -4 -4"
                stroke="#1c4237"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              {/* Olho Direito */}
              <path
                d="M 4 -4 Q 9 -11 14 -4"
                stroke="#1c4237"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Sorriso Gentil */}
            <path
              d="M -6 8 Q 0 14 6 8"
              stroke="#1c4237"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
