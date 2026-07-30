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

  // Especificações da curva SVG do arco (semi-arco inferior gracioso)
  // Raio: 130, centro (160, 90), arco de -150° até -30°
  const pathD = "M 35 125 A 130 110 0 0 1 285 125";

  // Cálculo da posição da semente perolada ao longo do arco (0% = início azul, 100% = fim damasco)
  // Usamos interpolação paramétrica de ângulo de 195° até 345° (ou t de 0 a 1)
  const seedPosition = useMemo(() => {
    // Ângulo em radianos de PI * 1.05 até PI * 1.95
    const angleStart = Math.PI * 0.95;
    const angleEnd = Math.PI * 0.05;
    const angle = angleStart + (normalizedState / 100) * (angleEnd - angleStart);

    const rx = 125;
    const ry = 95;
    const cx = 160;
    const cy = 135;

    const x = cx + rx * Math.cos(angle);
    const y = cy - ry * Math.sin(angle);

    // Ângulo de rotação da gota/semente perolada ao longo da tangente da curva
    const tangentAngle = (angle * 180) / Math.PI + 90;

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

      {/* Rótulo de Status e Progresso Passivo */}
      <div className="mood-arc-status-row">
        <div className="mood-arc-status-badge">
          <span className="mood-arc-dot" style={{ backgroundColor: statusInfo.color }} />
          <span className="mood-arc-label-text">
            {statusInfo.label} ({Math.round(emaState)})
          </span>
        </div>

        <span className="mood-arc-progress-text">
          Aprendendo seu tom... ({shown}/{maxMessages})
        </span>
      </div>
    </div>
  );
}
