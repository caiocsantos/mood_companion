import React from 'react';

/**
 * Emoji Avatar System featuring 5 visual stages:
 * STAGE -2: Angry/Exploding (Fiery red aura, steaming head, enraged eyes)
 * STAGE -1: Crying/Sad (Drooping eyes, teardrops escorrendo)
 * STAGE  0: Neutral/Peaceful (Calm neutral expression, gentle float)
 * STAGE +1: Happy (Smiling, blushing cheeks, cheerful)
 * STAGE +2: Radiantly In Love (Heart eyes, radiant aura, floating heart particles)
 */
export default function EmojiAvatar({ stage, size = 200 }) {
  const animClass = stage === 2 ? 'radiant-pulse' : stage === -2 ? 'angry-shake' : stage === -1 ? 'drooping-avatar' : 'floating-avatar';
  return (
    <div className={`avatar-svg-wrapper ${animClass}`} style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="emojiGlowDark" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="emojiGlowSad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="emojiGlowNeutral" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="emojiGlowHappy" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#831843" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="emojiGlowLove" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Glow Disk */}
        <circle 
          cx="150" 
          cy="150" 
          r="120" 
          fill={
            stage === -2 ? 'url(#emojiGlowDark)' :
            stage === -1 ? 'url(#emojiGlowSad)' :
            stage === 0 ? 'url(#emojiGlowNeutral)' :
            stage === 1 ? 'url(#emojiGlowHappy)' :
            'url(#emojiGlowLove)'
          } 
        />

        {/* Base Emoji Head Sphere */}
        <circle 
          cx="150" 
          cy="150" 
          r="75" 
          fill={
            stage === -2 ? '#f87171' :
            stage === -1 ? '#93c5fd' :
            stage === 0 ? '#fef08a' :
            stage === 1 ? '#fde047' :
            '#fbbf24'
          }
          stroke={
            stage === -2 ? '#b91c1c' :
            stage === -1 ? '#1d4ed8' :
            stage === 0 ? '#eab308' :
            stage === 1 ? '#ca8a04' :
             '#d97706'
          }
          strokeWidth="4"
        />

        {/* --- STAGE -2: ANGRY / EXPLODING --- */}
        {stage === -2 && (
          <g className="emoji-neg-2">
            {/* Steam puffing from top */}
            <path d="M 130,65 Q 120,40 135,35 T 145,50" stroke="#fca5a5" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 170,65 Q 180,40 165,35 T 155,50" stroke="#fca5a5" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />

            {/* Furious Eyebrows & Eyes */}
            <polygon points="105,120 140,135 140,128 105,115" fill="#7f1d1d" />
            <polygon points="195,120 160,135 160,128 195,115" fill="#7f1d1d" />
            <circle cx="125" cy="140" r="5" fill="#450a0a" />
            <circle cx="175" cy="140" r="5" fill="#450a0a" />

            {/* Enraged Mouth */}
            <path d="M 120,175 Q 150,150 180,175 Z" fill="#450a0a" />
            <path d="M 125,173 Q 150,165 175,173" stroke="#ffffff" strokeWidth="3" fill="none" />
          </g>
        )}

        {/* --- STAGE -1: CRYING / SAD --- */}
        {stage === -1 && (
          <g className="emoji-neg-1">
            {/* Sad Drooping Eyebrows */}
            <path d="M 105,125 Q 125,115 140,130" stroke="#1e40af" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 195,125 Q 175,115 160,130" stroke="#1e40af" strokeWidth="3.5" fill="none" strokeLinecap="round" />

            {/* Teary Eyes */}
            <ellipse cx="125" cy="140" rx="8" ry="10" fill="#1e3a8a" />
            <ellipse cx="175" cy="140" rx="8" ry="10" fill="#1e3a8a" />
            <circle cx="127" cy="137" r="3" fill="#ffffff" />
            <circle cx="177" cy="137" r="3" fill="#ffffff" />

            {/* Escorrendo Teardrops */}
            <path d="M 125,152 C 120,170 115,185 125,190 C 133,185 130,170 125,152 Z" fill="#60a5fa" />
            
            {/* Sad Trembling Mouth */}
            <path d="M 125,175 Q 150,162 175,175" stroke="#1e3a8a" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* --- STAGE 0: NEUTRAL / PEACEFUL --- */}
        {stage === 0 && (
          <g className="emoji-zero">
            {/* Serene Closed Eyes */}
            <path d="M 115,135 Q 125,125 135,135" stroke="#713f12" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M 165,135 Q 175,125 185,135" stroke="#713f12" strokeWidth="3.5" fill="none" strokeLinecap="round" />

            {/* Straight Neutral / Calm Mouth */}
            <path d="M 130,170 L 170,170" stroke="#713f12" strokeWidth="3.5" fill="none" strokeLinecap="round" />

            {/* Soft Cheeks */}
            <circle cx="110" cy="155" r="7" fill="#f87171" opacity="0.3" />
            <circle cx="190" cy="155" r="7" fill="#f87171" opacity="0.3" />
          </g>
        )}

        {/* --- STAGE +1: HAPPY --- */}
        {stage === 1 && (
          <g className="emoji-pos-1">
            {/* Happy Curved Eyes */}
            <path d="M 115,135 Q 125,120 135,135" stroke="#713f12" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 165,135 Q 175,120 185,135" stroke="#713f12" strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* Cheerful Open Smile */}
            <path d="M 120,160 Q 150,195 180,160 Z" fill="#713f12" />
            <path d="M 135,182 Q 150,192 165,182" fill="#f43f5e" />

            {/* Pink Blushing Cheeks */}
            <circle cx="108" cy="155" r="9" fill="#f43f5e" opacity="0.45" />
            <circle cx="192" cy="155" r="9" fill="#f43f5e" opacity="0.45" />
          </g>
        )}

        {/* --- STAGE +2: RADIANTLY IN LOVE --- */}
        {stage === 2 && (
          <g className="emoji-pos-2">
            {/* Big Heart Eyes 😍 */}
            <path d="M 125,120 Q 115,105 105,120 Q 95,135 125,150 Q 155,135 145,120 Q 135,105 125,120 Z" fill="#dc2626" />
            <path d="M 175,120 Q 165,105 155,120 Q 145,135 175,150 Q 205,135 195,120 Q 185,105 175,120 Z" fill="#dc2626" />

            {/* Glowing Smile */}
            <path d="M 122,165 Q 150,198 178,165 Z" fill="#78350f" />
            
            {/* Crown of Hearts / Sparkles Floating */}
            <path d="M 80,80 Q 80,75 84,75 Q 88,75 88,80 Q 88,86 84,90 Q 80,86 80,80 Z" fill="#ef4444" className="particle" />
            <path d="M 220,70 Q 220,65 224,65 Q 228,65 228,70 Q 228,76 224,80 Q 220,76 220,70 Z" fill="#ec4899" className="particle" />
            <circle cx="150" cy="50" r="4" fill="#fbbf24" className="particle" />
          </g>
        )}
      </svg>
    </div>
  );
}
