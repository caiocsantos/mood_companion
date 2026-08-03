import React from 'react';
import { getFlowerVisualState } from './flowerVisualState';

export default function FlowerAvatar({ stage, size = 180 }) {
  const visualState = getFlowerVisualState(stage);

  return (
    <div
      className="flower-avatar-wrapper"
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
        className="flower-warm-halo"
        style={{
          opacity: visualState.haloOpacity,
          transform: `scale(${0.9 + visualState.bloomScale * 0.08})`
        }}
      />

      <svg
        style={{ width: '100%', height: '100%' }}
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flower-idle-container"
      >
        <defs>
          <radialGradient id="pearlPetalGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor={visualState.petalEnd} />
            <stop offset="85%" stopColor={visualState.petalEnd} />
            <stop offset="100%" stopColor={visualState.petalStart} />
          </radialGradient>

          <radialGradient id="flowerCenterGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={visualState.centerStart} />
            <stop offset="60%" stopColor={visualState.centerEnd} />
            <stop offset="100%" stopColor={visualState.centerStart} />
          </radialGradient>

          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={visualState.stemStart} />
            <stop offset="100%" stopColor={visualState.stemEnd} />
          </linearGradient>

          <filter id="softFlowerShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#8e736a" floodOpacity="0.18" />
          </filter>
        </defs>

        <g className="flower-animated-body" filter="url(#softFlowerShadow)">
          <g className="flower-stem-group" transform={`rotate(${visualState.stemLean} 150 260)`}>
            <path
              d="M 150 260 Q 135 195 150 135"
              stroke="url(#stemGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 146 210 Q 110 195 105 210 Q 125 225 146 215 Z"
              fill={visualState.stemStart}
            />
            <path
              d="M 152 185 Q 188 170 195 185 Q 175 200 152 190 Z"
              fill={visualState.stemEnd}
            />
          </g>

          <g transform={`translate(150, 125) scale(${visualState.bloomScale})`} className="flower-head-group">
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <g key={i} transform={`rotate(${deg})`}>
                <path
                  d={`M 0 -22 C ${-12 * visualState.petalOpen} -55, ${-16 * visualState.petalOpen} -78, 0 -92 C ${16 * visualState.petalOpen} -78, ${12 * visualState.petalOpen} -55, 0 -22 Z`}
                  fill="url(#pearlPetalGrad)"
                  stroke="rgba(255, 255, 255, 0.7)"
                  strokeWidth="1.5"
                />
                <ellipse cx="-4" cy="-65" rx="4" ry="12" fill="#ffffff" opacity="0.6" transform={`rotate(${-10 + visualState.eyeTilt} -4 -65)`} />
              </g>
            ))}

            <circle cx="0" cy="0" r="32" fill="url(#flowerCenterGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

            <g className="flower-face-eyes" transform={`translate(0 ${visualState.faceY})`}>
              <path
                d="M -14 -4 Q -9 -11 -4 -4"
                stroke="#1c4237"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                transform={`rotate(${visualState.eyeTilt} -9 -4)`}
              />
              <path
                d="M 4 -4 Q 9 -11 14 -4"
                stroke="#1c4237"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                transform={`rotate(${-visualState.eyeTilt} 9 -4)`}
              />
            </g>

            <path
              d={visualState.faceExpression === 'sad'
                ? 'M -8 8 Q 0 4 8 8'
                : visualState.faceExpression === 'joy'
                  ? 'M -8 8 Q 0 16 8 8'
                  : 'M -6 8 Q 0 14 6 8'}
              stroke="#1c4237"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              transform={`scale(1 ${visualState.mouthCurve})`}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
