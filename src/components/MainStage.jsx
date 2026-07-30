import React, { useState } from 'react';
import FlowerAvatar from './avatars/FlowerAvatar';
import SunAvatar from './avatars/SunAvatar';
import EmojiAvatar from './avatars/EmojiAvatar';
import WateringParticles from './WateringParticles';
import { COMPANION_DATA } from '../services/sentimentEngine';

export default function MainStage({ 
  activeAvatar, 
  stage, 
  score, 
  messageCount, 
  isDigesting 
}) {
  const [clickReact, setClickReact] = useState(false);
  const companionInfo = COMPANION_DATA[activeAvatar];
  const stageDetails = companionInfo.stages[stage.toString()];

  // Interactive Click Reaction
  const handleAvatarClick = () => {
    setClickReact(true);
    setTimeout(() => setClickReact(false), 600);
  };

  // Map score -5 to +5 to slider knob percentage (0% to 100%)
  const knobPercent = Math.min(Math.max(((score + 5) / 10) * 100, 3), 97);

  // Status dot color
  const dotColor = 
    stage === -2 ? '#f43f5e' :
    stage === -1 ? '#38bdf8' :
    stage === 0 ? '#eae6df' :
    stage === 1 ? '#f472b6' :
    '#fbbf24';

  return (
    <section className="w-full px-6 pt-2 pb-4 flex flex-col items-center relative">
      
      {/* Watering Droplets Animation ("água do regador") */}
      <WateringParticles isDigesting={isDigesting} />

      {/* Hero Avatar Display Container */}
      <div 
        onClick={handleAvatarClick}
        className={`avatar-stage-container cursor-pointer transform transition-all ${
          isDigesting ? 'avatar-digesting' :
          clickReact ? 'scale-105 rotate-2' : 'hover:scale-102'
        }`}
        title="Toque para interagir!"
      >
        {activeAvatar === 'flower' && <FlowerAvatar stage={stage} isInteractive={clickReact} />}
        {activeAvatar === 'sun' && <SunAvatar stage={stage} isInteractive={clickReact} />}
        {activeAvatar === 'emoji' && <EmojiAvatar stage={stage} isInteractive={clickReact} />}
      </div>

      {/* 5-Segmented Gradient Sentiment Slider matching Screenshot */}
      <div className="w-full max-w-sm mt-3 px-1">
        {/* Slider Labels */}
        <div className="flex justify-between items-center text-xs text-[#8e8c87] font-medium mb-1.5">
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full inline-block" 
              style={{ backgroundColor: dotColor }} 
            />
            <span className="text-[#e2e2e0] font-bold">{stageDetails.name}</span>
          </div>

          <span className="text-[11px] text-[#8e8c87] font-normal">
            Learning your tone... ({Math.min(messageCount, 5)}/5)
          </span>
        </div>

        {/* Sentiment Slider Bar Track */}
        <div className="sentiment-slider-track">
          {/* Segment Dividers */}
          <div className="slider-segment-divider" style={{ left: '25%' }} />
          <div className="slider-segment-divider" style={{ left: '50%' }} />
          <div className="slider-segment-divider" style={{ left: '75%' }} />

          {/* Slider Position Knob */}
          <div 
            className="sentiment-slider-knob"
            style={{ left: `${knobPercent}%` }}
          />
        </div>
      </div>

    </section>
  );
}
