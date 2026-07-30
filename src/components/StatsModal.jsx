import React from 'react';
import { BarChart2, X, RotateCcw, TrendingUp, Heart, Smile, Frown, Meh } from 'lucide-react';
import { COMPANION_DATA } from '../services/sentimentEngine';

export default function StatsModal({ 
  isOpen, 
  onClose, 
  score, 
  stage, 
  activeAvatar, 
  messages, 
  onResetScore 
}) {
  if (!isOpen) return null;

  const currentCompanion = COMPANION_DATA[activeAvatar];
  const stageInfo = currentCompanion.stages[stage.toString()];

  // Calculate message sentiment stats
  const posCount = messages.filter(m => m.tone === 'positive').length;
  const negCount = messages.filter(m => m.tone === 'negative').length;
  const neuCount = messages.filter(m => m.tone === 'neutral').length;

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel p-6 sm:p-8 max-w-md w-full border border-white/60 shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Estatísticas de Humor</h2>
            <p className="text-xs text-slate-500">Acompanhamento do seu progresso emocional</p>
          </div>
        </div>

        {/* Current Score Card */}
        <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/80 mb-5 shadow-sm text-center">
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pontuação de Balanço</span>
          <div className="text-3xl font-extrabold text-slate-800 my-1">
            {score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1)}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mt-1" style={{ backgroundColor: stageInfo.badgeColor + '20', color: stageInfo.badgeColor }}>
            <span>Estágio {stage}: {stageInfo.name}</span>
          </div>
        </div>

        {/* Tone Breakdown Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
            <Smile className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-emerald-900 block">{posCount}</span>
            <span className="text-[10px] text-emerald-700">Positivos</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <Meh className="w-5 h-5 text-slate-500 mx-auto mb-1" />
            <span className="text-xs font-bold text-slate-800 block">{neuCount}</span>
            <span className="text-[10px] text-slate-500">Neutros</span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-center">
            <Frown className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <span className="text-xs font-bold text-rose-900 block">{negCount}</span>
            <span className="text-[10px] text-rose-700">Desabafos</span>
          </div>
        </div>

        {/* Reset Progress Action */}
        <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
          <button
            onClick={onResetScore}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Balanço (Reiniciar 0)</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
}
