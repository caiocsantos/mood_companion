import React from 'react';
import { ChevronRight, Flower2, Sun, Smile } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, selectedAvatar, onSelectAvatar }) {
  if (!isOpen) return null;

  const companions = [
    {
      id: 'flower',
      name: 'Flower',
      description: 'Blooms with positivity, droops when sad, closes when stressed.',
      icon: <Flower2 className="w-5 h-5 text-pink-400" />,
      badgeBg: '#3d202d'
    },
    {
      id: 'sun',
      name: 'Sun',
      description: 'Shines bright with joy, rainy when sad, stormy when stressed.',
      icon: <Sun className="w-5 h-5 text-amber-400" />,
      badgeBg: '#3d341a'
    },
    {
      id: 'emoji',
      name: 'Emoji',
      description: 'Expressive faces that match your emotional state.',
      icon: <Smile className="w-5 h-5 text-amber-400" />,
      badgeBg: '#3d2d1a'
    }
  ];

  const handleSelect = (id) => {
    onSelectAvatar(id);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-[#181716] z-50 flex flex-col p-6 overflow-y-auto">
      
      {/* Header Title */}
      <div className="text-center pt-8 mb-10">
        <h1 className="brand-title text-3xl mb-2">MoodCompanion</h1>
        <p className="text-zinc-400 text-sm font-medium">Choose your Emotional Companion</p>
      </div>

      {/* Companion Cards List */}
      <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
        {companions.map((comp) => (
          <button
            key={comp.id}
            onClick={() => handleSelect(comp.id)}
            className={`w-full p-4 rounded-2xl bg-[#252422] hover:bg-[#2d2b28] border transition-all text-left flex items-center justify-between group ${
              selectedAvatar === comp.id ? 'border-[#b4cda6]' : 'border-[#33312d]'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Circular Icon Badge */}
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: comp.badgeBg }}
              >
                {comp.icon}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-zinc-100 font-semibold text-base group-hover:text-[#b4cda6] transition-colors">
                  {comp.name}
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5 leading-snug max-w-[210px]">
                  {comp.description}
                </p>
              </div>
            </div>

            {/* Right Chevron */}
            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0" />
          </button>
        ))}
      </div>

    </div>
  );
}
