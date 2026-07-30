import React, { useMemo } from 'react';
import { getEmaStatusInfo } from '../services/emotionalState';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * Regra 2 — Arco de Humor Passivo com Semente Perolada
 * ═══════════════════════════════════════════════════════════════════════════════
 * - Desabilita qualquer interatividade (100% passivo)
 * - Gradiente pastel: Pastel Blue (#9bb8ed) -> Mint (#98dfcb) -> Apricot (#ffc09f)
 * - Transição suave de movimento da semente perolada (1.5s, Ease-In-Out)
 * - Animação de fade de gradiente conforme a cor dominante muda
 */
export default function PassiveMoodArc({ emaState, messageCount }) {
  // emaState varia de 0 a 100
  const normalizedState = Math.max(0, Math.min(100, emaState));

  // Especificações da curva SVG do arco — usar uma curva cúbica (sorriso)
  // Isso cria extremidades viradas para cima (como o termômetro da imagem)
  // Pontos ajustados verticalmente para aproximar o arco do avatar
  // Subimos o arco cerca de 1cm (~38px)
  const pathD = "M 35 57 C 90 127, 230 127, 285 57";

  // Cálculo da posição da semente perolada ao longo do arco (0% = início azul, 100% = fim damasco)
  // Usamos interpolação paramétrica de ângulo de 195° até 345° (ou t de 0 a 1)
  const seedPosition = useMemo(() => {
      // Usamos uma curva cúbica Bézier: P0, P1, P2, P3
      const P0 = { x: 35, y: 57 };
      const P1 = { x: 90, y: 127 };
      const P2 = { x: 230, y: 127 };
      const P3 = { x: 285, y: 57 };

      const t = normalizedState / 100;

      // Bézier cúbica (posição)
      const mt = 1 - t;
      const x = (mt * mt * mt) * P0.x + 3 * (mt * mt) * t * P1.x + 3 * mt * (t * t) * P2.x + (t * t * t) * P3.x;
      const y = (mt * mt * mt) * P0.y + 3 * (mt * mt) * t * P1.y + 3 * mt * (t * t) * P2.y + (t * t * t) * P3.y;

      // Derivada para tangente (direção) — usado para rotação da semente
      const dx = 3 * (mt * mt) * (P1.x - P0.x) + 6 * mt * t * (P2.x - P1.x) + 3 * (t * t) * (P3.x - P2.x);
      const dy = 3 * (mt * mt) * (P1.y - P0.y) + 6 * mt * t * (P2.y - P1.y) + 3 * (t * t) * (P3.y - P2.y);
      const tangentAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

      return { x, y, rotation: tangentAngle };
  }, [normalizedState]);

  const statusInfo = getEmaStatusInfo(normalizedState);
  const maxMessages = 10;
  const shown = Math.min(messageCount, maxMessages);

  return (
    <div className="mood-arc-container">
      {/* Arco SVG com Gradiente Pastel e Semente Perolada */}
      <svg
        className="mood-arc-svg"
        viewBox="0 0 320 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente Pastel: Blue -> Mint -> Apricot */}
          <linearGradient id="arcPastelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9bb8ed" />    {/* Pastel Blue */}
            <stop offset="50%" stopColor="#98dfcb" />   {/* Soft Mint */}
            <stop offset="100%" stopColor="#ffc09f" />  {/* Apricot / Peach */}
          </linearGradient>

          {/* Sombra suave para o arco */}
          <filter id="arcGlow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#98dfcb" floodOpacity="0.3" />
          </filter>

          {/* Gradiente Perolado 3D para a Semente (Pearl Seed) */}
          <radialGradient id="pearlSeedGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f7ebd9" />
            <stop offset="85%" stopColor="#e5d0b5" />
            <stop offset="100%" stopColor="#c8b090" />
          </radialGradient>

          {/* Sombra da Semente */}
          <filter id="seedShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#4a3f35" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Trilha do Arco com Gradiente Pastel */}
        <path
          d={pathD}
          stroke="url(#arcPastelGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          filter="url(#arcGlow)"
          className="mood-arc-path"
        />

        {/* Trilha interna com transparência suave */}
        <path
          d={pathD}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Semente Perolada (Pearl Seed) Animada (1.5s, Ease-In-Out) */}
        <g
          className="pearl-seed-group"
          style={{
            transform: `translate(${seedPosition.x}px, ${seedPosition.y}px) rotate(${seedPosition.rotation}deg)`,
            transition: 'transform 1.5s cubic-bezier(0.42, 0, 0.58, 1)',
          }}
          filter="url(#seedShadow)"
        >
          {/* Forma de Gota / Semente 3D Perolada */}
          <path
            d="M 0 -12 C 7 -4, 10 4, 0 12 C -10 4, -7 -4, 0 -12 Z"
            fill="url(#pearlSeedGrad)"
            stroke="rgba(255, 255, 255, 0.8)"
            strokeWidth="1"
          />
          {/* Brilho Especular da Pérola */}
          <ellipse cx="-2" cy="-4" rx="2" ry="4" fill="#ffffff" opacity="0.85" />
        </g>
      </svg>

      {/* Rótulo de Status — exibe descrição sem contadores */}
      <div className="mood-arc-status-row">
        <div className="mood-arc-status-badge">
          <span className="mood-arc-dot" style={{ backgroundColor: statusInfo.color }} />
          <span className="mood-arc-label-text">{statusInfo.label}</span>
        </div>

        <span className="mood-arc-progress-text">Aprendendo seu tom...</span>
      </div>
    </div>
  );
}
