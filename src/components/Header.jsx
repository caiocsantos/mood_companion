import React from 'react';
import { UserCheck } from 'lucide-react';

export default function Header({ 
  onOpenOnboarding 
}) {
  return (
    <header className="w-full px-6 pt-6 pb-2 flex items-center justify-between bg-[#1b1916] z-10">
      <div className="w-6" /> {/* Left Spacer to center title */}

      {/* Centered App Logo */}
      <h1 
        onClick={onOpenOnboarding} 
        className="brand-title text-2xl cursor-pointer hover:opacity-90 transition-opacity"
      >
        MoodCompanion
      </h1>

      {/* Companion Switch Icon Top Right */}
      <button
        onClick={onOpenOnboarding}
        className="text-[#b5ccaa] hover:text-zinc-200 transition-colors p-1"
        title="Trocar Companheiro"
      >
        <UserCheck className="w-6 h-6 stroke-[2.2]" />
      </button>
    </header>
  );
}
