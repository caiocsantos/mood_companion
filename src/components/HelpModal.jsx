import React from 'react';
import { ShieldAlert, Phone, HeartHandshake, X, ExternalLink } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content glass-panel p-6 sm:p-8 max-w-lg w-full border border-rose-200/80 shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Apoio Emocional & Ajuda</h2>
            <p className="text-xs text-slate-500 font-medium">Você não está sozinho(a). Há sempre ajuda disponível.</p>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 mb-5 leading-relaxed">
          <strong>Aviso Importante:</strong> O MoodCompanion é um diário interativo e espelho de reflexão pessoal, não substituindo acompanhamento médico ou psicológico profissional.
        </div>

        {/* Crisis Lines Section (CVV - Centro de Valorização da Vida) */}
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-100">CVV - Brasil</span>
              <h3 className="text-lg font-bold">Ligue 188 (Gratuito)</h3>
              <p className="text-xs text-rose-100 mt-0.5">Atendimento 24h, gratuito e confidencial.</p>
            </div>
            <a 
              href="tel:188"
              className="p-3 bg-white text-rose-600 rounded-xl font-bold text-xs shadow hover:bg-rose-50 transition-colors flex items-center gap-1"
            >
              <Phone className="w-4 h-4" />
              <span>Ligar 188</span>
            </a>
          </div>

          {/* Web CVV Chat */}
          <a
            href="https://www.cvv.org.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white/70 hover:bg-white text-slate-700 font-medium text-xs transition-all shadow-sm"
          >
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-500" />
              <span>Chat Online no Portal CVV.org.br</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Emergency Note */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
          >
            Compreendi e quero voltar ao app
          </button>
        </div>

      </div>
    </div>
  );
}
