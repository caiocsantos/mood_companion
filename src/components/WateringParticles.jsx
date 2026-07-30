import React from 'react';

/**
 * WateringParticles - Visual metaphor for "água do regador"
 * Renders liquid droplets flowing from the message area up towards the avatar to nourish it.
 */
export default function WateringParticles({ isDigesting }) {
  if (!isDigesting) return null;

  // Generate 8 animated water/energy droplets
  const droplets = Array.from({ length: 8 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {droplets.map((_, i) => {
        const leftOffset = 25 + (i * 7); // Spread across center
        const delay = i * 0.15; // Staggered flow
        const size = 6 + (i % 3) * 2;

        return (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-b from-sky-300 via-teal-200 to-[#a7c997] shadow-sm opacity-90 animate-waterDrop"
            style={{
              left: `${leftOffset}%`,
              bottom: '100px',
              width: `${size}px`,
              height: `${size * 1.5}px`,
              animationDelay: `${delay}s`,
              animationDuration: '1.4s'
            }}
          />
        );
      })}
    </div>
  );
}
