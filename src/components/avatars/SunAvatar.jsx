import React from 'react';

/**
 * Sun Avatar System featuring 5 visual stages:
 * STAGE -2: Stormy Sun (Hidden behind dark thunderclouds, purple lightning flashes)
 * STAGE -1: Rain/Clouds Sun (Pale sun behind grey rain clouds, falling raindrops)
 * STAGE  0: Soft Sun (Calm pastel yellow sun with gentle rays)
 * STAGE +1: Bright Sun (Vibrant smiling golden sun, warm rays)
 * STAGE +2: Golden Sun (Golden crown sun, glowing aura, floating sparkles)
 */
export default function SunAvatar({ stage, size = 200 }) {
  const animClass = stage === 2 ? 'radiant-pulse' : stage === -2 ? 'angry-shake' : stage === -1 ? 'drooping-avatar' : 'floating-avatar';
  return (
    <div className={`avatar-svg-wrapper ${animClass}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sunGlowDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#581c87" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGlowSad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGlowNeutral" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fde047" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGlowBright" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunGlowGolden" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle 
          cx="150" 
          cy="150" 
          r="125" 
          fill={
            stage === -2 ? 'url(#sunGlowDark)' :
            stage === -1 ? 'url(#sunGlowSad)' :
            stage === 0 ? 'url(#sunGlowNeutral)' :
            stage === 1 ? 'url(#sunGlowBright)' :
            'url(#sunGlowGolden)'
          } 
        />

        {/* --- STAGE -2: STORMY SUN --- */}
        {stage === -2 && (
          <g className="sun-stage-neg-2">
            {/* Dimmed Sun Disk behind dark clouds */}
            <circle cx="150" cy="140" r="55" fill="#78350f" opacity="0.6" />
            
            {/* Dark Storm Clouds */}
            <path d="M 60,120 Q 90,90 130,100 Q 170,80 200,105 Q 240,110 230,145 Q 210,175 180,165 Q 120,180 70,150 Z" fill="#1e1b4b" opacity="0.9" />
            <path d="M 90,140 Q 120,115 160,125 Q 200,105 225,135 Q 245,160 215,185 Q 160,200 95,170 Z" fill="#311042" opacity="0.85" />

            {/* Lightning Bolt */}
            <polygon points="145,160 130,195 145,195 135,230 165,185 150,185" fill="#facc15" stroke="#f59e0b" strokeWidth="1" />
            
            {/* Angry Eyes on Sun in background */}
            <path d="M 125,120 L 140,128" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            <path d="M 175,120 L 160,128" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* --- STAGE -1: RAINY SUN --- */}
        {stage === -1 && (
          <g className="sun-stage-neg-1">
            {/* Pale Sun Disk */}
            <circle cx="150" cy="130" r="55" fill="#fef08a" opacity="0.5" />

            {/* Grey Clouds */}
            <path d="M 70,120 Q 100,95 140,105 Q 180,90 210,115 Q 240,130 220,160 Q 170,175 80,150 Z" fill="#64748b" opacity="0.75" />

            {/* Raindrops */}
            <line x1="100" y1="170" x2="92" y2="195" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="140" y1="175" x2="132" y2="205" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="180" y1="170" x2="172" y2="198" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

            {/* Drooping Eyes */}
            <path d="M 130,125 Q 135,132 140,125" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 160,125 Q 165,132 170,125" stroke="#475569" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* --- STAGE 0: SOFT SUN --- */}
        {stage === 0 && (
          <g className="sun-stage-zero">
            {/* Gentle Sun Rays */}
            <g stroke="#fde047" strokeWidth="4" strokeLinecap="round" opacity="0.7">
              <line x1="150" y1="50" x2="150" y2="30" />
              <line x1="150" y1="250" x2="150" y2="270" />
              <line x1="50" y1="150" x2="30" y2="150" />
              <line x1="250" y1="150" x2="270" y2="150" />
              <line x1="79" y1="79" x2="65" y2="65" />
              <line x1="221" y1="221" x2="235" y2="235" />
              <line x1="79" y1="221" x2="65" y2="235" />
              <line x1="221" y1="79" x2="235" y2="65" />
            </g>

            {/* Soft Sun Disk */}
            <circle cx="150" cy="150" r="60" fill="#fef08a" stroke="#facc15" strokeWidth="3" />
            
            {/* Calm Smiling Face */}
            <path d="M 130,140 Q 136,134 142,140" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 158,140 Q 164,134 170,140" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 140,165 Q 150,175 160,165" stroke="#78350f" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Soft Rosy Cheeks */}
            <circle cx="125" cy="155" r="6" fill="#f43f5e" opacity="0.25" />
            <circle cx="175" cy="155" r="6" fill="#f43f5e" opacity="0.25" />
          </g>
        )}

        {/* --- STAGE +1: BRIGHT SUN --- */}
        {stage === 1 && (
          <g className="sun-stage-pos-1">
            {/* Vibrant Rotating Sun Rays */}
            <g stroke="#fbbf24" strokeWidth="6" strokeLinecap="round">
              <line x1="150" y1="40" x2="150" y2="15" />
              <line x1="150" y1="260" x2="150" y2="285" />
              <line x1="40" y1="150" x2="15" y2="150" />
              <line x1="260" y1="150" x2="285" y2="150" />
              <line x1="72" y1="72" x2="54" y2="54" />
              <line x1="228" y1="228" x2="246" y2="246" />
              <line x1="72" y1="228" x2="54" y2="246" />
              <line x1="228" y1="72" x2="246" y2="54" />
            </g>

            {/* Golden Sun Disk */}
            <circle cx="150" cy="150" r="65" fill="#facc15" stroke="#f59e0b" strokeWidth="4" />
            
            {/* Happy Eyes & Big Smile */}
            <circle cx="132" cy="140" r="4.5" fill="#78350f" />
            <circle cx="168" cy="140" r="4.5" fill="#78350f" />
            <path d="M 132,160 Q 150,180 168,160 Z" fill="#78350f" />

            {/* Bright Blushing Cheeks */}
            <circle cx="122" cy="155" r="7" fill="#f43f5e" opacity="0.4" />
            <circle cx="178" cy="155" r="7" fill="#f43f5e" opacity="0.4" />
          </g>
        )}

        {/* --- STAGE +2: GOLDEN RADIANT SUPER SUN --- */}
        {stage === 2 && (
          <g className="sun-stage-pos-2">
            {/* Glowing Flare Halo */}
            <circle cx="150" cy="150" r="85" fill="none" stroke="#fef08a" strokeWidth="4" strokeDasharray="8 6" opacity="0.8" />
            
            {/* Radiant Rays */}
            <g stroke="#f59e0b" strokeWidth="7" strokeLinecap="round">
              <line x1="150" y1="35" x2="150" y2="10" />
              <line x1="150" y1="265" x2="150" y2="290" />
              <line x1="35" y1="150" x2="10" y2="150" />
              <line x1="265" y1="150" x2="290" y2="150" />
              <line x1="68" y1="68" x2="48" y2="48" />
              <line x1="232" y1="232" x2="252" y2="252" />
              <line x1="68" y1="232" x2="48" y2="252" />
              <line x1="232" y1="68" x2="252" y2="48" />
            </g>

            {/* Golden Core */}
            <circle cx="150" cy="150" r="68" fill="#fbbf24" stroke="#d97706" strokeWidth="5" />
            
            {/* Golden Crown */}
            <polygon points="120,80 135,95 150,75 165,95 180,80 170,105 130,105" fill="#fef08a" stroke="#b45309" strokeWidth="2" />
            
            {/* Starry Eyes & Loving Smile */}
            <path d="M 132,138 L 134,143 L 139,141 L 136,146 L 140,149 L 134,149 L 132,154 L 130,149 L 124,149 L 128,146 L 125,141 L 130,143 Z" fill="#78350f" />
            <path d="M 168,138 L 170,143 L 175,141 L 172,146 L 176,149 L 170,149 L 168,154 L 166,149 L 160,149 L 164,146 L 161,141 L 166,143 Z" fill="#78350f" />
            <path d="M 130,165 Q 150,190 170,165" stroke="#78350f" strokeWidth="3.5" fill="none" strokeLinecap="round" />

            {/* Sparkles */}
            <circle cx="90" cy="60" r="4" fill="#ffffff" className="particle" />
            <circle cx="210" cy="50" r="5" fill="#fef08a" className="particle" />
            <circle cx="60" cy="200" r="3" fill="#fbbf24" className="particle" />
          </g>
        )}
      </svg>
    </div>
  );
}
