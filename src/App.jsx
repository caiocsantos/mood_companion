import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import GIF from 'gif.js';
import FlowerAvatar from './components/avatars/FlowerAvatar';
import SunAvatar from './components/avatars/SunAvatar';
import EmojiAvatar from './components/avatars/EmojiAvatar';
import PassiveMoodArc from './components/PassiveMoodArc';
import { analyzeLocal } from './services/localNLP';
import { interceptMessage, enqueueSubstantiveMessage } from './services/messageMiddleware';
import { calculateNextEMA, emaToStage, emaToScore, DEFAULT_EMA_STATE } from './services/emotionalState';
import { classifyBatchWithGemini } from './services/geminiClassifier';
import { getAIResponse } from './services/aiCompanion';

/* ─── Companion list items for selection screen ──────────────────────── */
const COMPANIONS = [
  {
    key: 'flower',
    name: 'Flower (A Flor)',
    desc: 'Flor perolada serena que desabrocha com bons sentimentos.',
    iconBg: '#fceceb',
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="8" fill="#e8c2c8" />
        <ellipse cx="20" cy="10" rx="4" ry="6" fill="#f4dadf" opacity="0.9"/>
        <ellipse cx="20" cy="30" rx="4" ry="6" fill="#f4dadf" opacity="0.9"/>
        <ellipse cx="10" cy="20" rx="6" ry="4" fill="#f4dadf" opacity="0.9"/>
        <ellipse cx="30" cy="20" rx="6" ry="4" fill="#f4dadf" opacity="0.9"/>
        <circle cx="20" cy="20" r="5" fill="#a3d9c9" />
      </svg>
    )
  },
  {
    key: 'sun',
    name: 'Sun (O Sol)',
    desc: 'Sol suave que ilumina o ambiente conforme sua energia.',
    iconBg: '#fef5d9',
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="8" fill="#f0c040" />
        {[0,45,90,135,180,225,270,315].map((deg, i) => (
          <line
            key={i}
            x1="20" y1="20"
            x2={20 + Math.cos((deg * Math.PI) / 180) * 14}
            y2={20 + Math.sin((deg * Math.PI) / 180) * 14}
            stroke="#d4a020" strokeWidth="2.5" strokeLinecap="round"
          />
        ))}
        <circle cx="20" cy="20" r="6" fill="#fde047" />
      </svg>
    )
  },
  {
    key: 'emoji',
    name: 'Emoji (O Emoji)',
    desc: 'Expressões peroladas que refletem seu estado interior.',
    iconBg: '#e8f4ec',
    Icon: () => (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="14" fill="#98dfcb" />
        <circle cx="15" cy="17" r="2" fill="#1c4237" />
        <circle cx="25" cy="17" r="2" fill="#1c4237" />
        <path d="M14 24 Q20 29 26 24" stroke="#1c4237" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    )
  }
];

/* ─── Chevron SVG ─────────────────────────────────────────────────────── */
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ─── Send icon ─────────────────────────────────────────────────────── */
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

/* ─── Users icon ─────────────────────────────────────────────────────── */
const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

/* ─── Avatar renderer ─────────────────────────────────────────────────── */
function AvatarRenderer({ avatarKey, stage }) {
  const props = { stage, size: 175 };
  if (avatarKey === 'sun')   return <SunAvatar {...props} />;
  if (avatarKey === 'emoji') return <EmojiAvatar {...props} />;
  return <FlowerAvatar {...props} />;
}

/* ─── Message bubble ─────────────────────────────────────────────────── */
function MessageBubble({ msg }) {
  return (
    <div className={`message-row ${msg.sender}`}>
      <div className={`message-bubble ${msg.sender}`}>
        {msg.text}
      </div>
      <span className="message-time">{msg.timestamp}</span>
    </div>
  );
}

/* ─── Share icon ────────────────────────────────────────────────────── */
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" style={{width:18,height:18}}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

/* ─── Typing indicator (Animação de Reticências) ───────────────────────── */
function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-bubble">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

/* ─── Screen 1: Avatar Selection ─────────────────────────────────────── */
function SelectionScreen({ onSelect }) {
  return (
    <div className="screen selection-screen">
      <div className="selection-header">
        <h1 className="app-title">MoodCompanion</h1>
        <p className="selection-subtitle">Escolha seu Companheiro Emocional</p>
        <p className="selection-note">Modo protótipo para acompanhar suas emoções e expressar como se sente.</p>
      </div>

      <div className="avatar-list">
        {COMPANIONS.map((c) => (
          <button
            key={c.key}
            className="avatar-list-item"
            onClick={() => onSelect(c.key)}
            style={{ outline: 'none', width: '100%', textAlign: 'left' }}
          >
            <div className="avatar-icon-wrapper" style={{ background: c.iconBg }}>
              <c.Icon />
            </div>
            <div className="avatar-list-text" style={{ flex: 1 }}>
              <div className="avatar-list-name">{c.name}</div>
              <div className="avatar-list-desc">{c.desc}</div>
            </div>
            <div className="avatar-list-chevron">
              <ChevronRight />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Screen 2: Chat ─────────────────────────────────────────────────── */
function ChatScreen({ avatarKey, onChangeAvatar }) {
  const [emaState, setEmaState] = useState(() => {
    const saved = localStorage.getItem('mc_ema_state');
    return saved ? parseFloat(saved) : DEFAULT_EMA_STATE;
  });

  const [displayedEma, setDisplayedEma] = useState(emaState);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('mc_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isDigesting, setIsDigesting] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Regra 3: Suavização contínua do EMA (0..100)
  useEffect(() => {
    if (Math.abs(displayedEma - emaState) < 0.2) {
      setDisplayedEma(emaState);
      return;
    }
    const timer = setInterval(() => {
      setDisplayedEma(prev => {
        const diff = emaState - prev;
        if (Math.abs(diff) < 0.2) {
          clearInterval(timer);
          return emaState;
        }
        return prev + (diff > 0 ? 0.3 : -0.3);
      });
    }, 30);
    return () => clearInterval(timer);
  }, [emaState, displayedEma]);

  // Persistência
  useEffect(() => {
    localStorage.setItem('mc_ema_state', emaState.toString());
    localStorage.setItem('mc_avatar', avatarKey);
    localStorage.setItem('mc_messages', JSON.stringify(messages));
  }, [emaState, avatarKey, messages]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const currentStage = emaToStage(displayedEma);

  // Debounce 45s Gemini Batch Flush
  const handleFlushGeminiBatch = async (batch) => {
    console.log('[Debounce 45s] Processando lote via Gemini REST:', batch);
    const result = await classifyBatchWithGemini(batch);

    if (result && typeof result.score === 'number') {
      setEmaState(prevEma => calculateNextEMA(prevEma, result.score, false));
    }
  };

  // Envio de mensagem pelo usuário
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Middleware de Interceptação
    const interception = interceptMessage(text);

    let targetInputScore = 0;
    let tone = 'neutral';

    if (interception.isNeutral) {
      targetInputScore = 0;
      tone = 'neutral';
    } else if (interception.isEmojiOnly) {
      targetInputScore = interception.score;
      tone = targetInputScore > 0 ? 'positive' : targetInputScore < 0 ? 'negative' : 'neutral';
    } else if (interception.isSubstantive) {
      const nlpResult = analyzeLocal(text);
      targetInputScore = nlpResult.score;
      tone = nlpResult.tone;
      enqueueSubstantiveMessage(text, handleFlushGeminiBatch);
    }

    const nextEma = calculateNextEMA(emaState, targetInputScore, false);
    setEmaState(nextEma);

    // Adiciona mensagem do usuário
    const userMsg = { id: Date.now().toString(), sender: 'user', text, tone, timestamp };
    setMessages(prev => [...prev, userMsg]);

    setIsDigesting(true);
    setTimeout(() => setIsDigesting(false), 2000);

    // Ativa animação de reticências (...)
    setIsTyping(true);

    const minTypingDelayMs = Math.max(2200, Math.min(3800, 1800 + text.length * 30));
    const delayPromise = new Promise(resolve => setTimeout(resolve, minTypingDelayMs));
    const currentScore = emaToScore(nextEma);
    const aiResponsePromise = getAIResponse(text, currentScore, emaToStage(nextEma));

    try {
      const [aiText] = await Promise.all([aiResponsePromise, delayPromise]);

      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: aiText,
        timestamp: aiTimestamp
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error('AI response error:', e);
      await delayPromise;
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'companion',
        text: 'Estou aqui com você. Pode me contar mais?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextarea = (e) => {
    setInputText(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 100) + 'px';
  };

  return (
    <div className="screen chat-screen">
      {/* App Bar */}
      <div className="app-bar">
        <span className="app-bar-title">MoodCompanion</span>
        <div style={{display:'flex', gap:8}}>
          <button className="app-bar-btn" onClick={onChangeAvatar} title="Mudar companheiro">
            <UsersIcon />
          </button>
          <button className="app-bar-btn" onClick={async () => {
            try {
              const avatarNode = document.querySelector('.avatar-stage');
              const arcNode = document.querySelector('.mood-arc-container');
              if (!avatarNode || !arcNode) throw new Error('Elements not found');

              const wrapper = document.createElement('div');
              wrapper.style.position = 'fixed';
              wrapper.style.left = '-9999px';
              wrapper.style.top = '0';
              wrapper.style.zIndex = '9999';
              wrapper.style.padding = '8px';
              wrapper.style.background = '#ffffff'; // force white background for captures

              const title = document.createElement('div');
              title.textContent = 'MoodCompanion';
              title.style.fontFamily = "'Outfit', sans-serif";
              title.style.fontWeight = '700';
              title.style.fontSize = '14px';
              title.style.color = '#27402c';
              title.style.position = 'absolute';
              title.style.top = '8px';
              title.style.left = '16px';
              title.style.letterSpacing = '-0.4px';

              const aClone = avatarNode.cloneNode(true);
              const cClone = arcNode.cloneNode(true);
              // remove descriptive labels from the cloned arc so GIF contains only avatar + graph
              const statusRow = cClone.querySelector('.mood-arc-status-row');
              if (statusRow) statusRow.remove();
              wrapper.appendChild(title);
              wrapper.appendChild(aClone);
              wrapper.appendChild(cClone);
              document.body.appendChild(wrapper);

              const frames = 16;
              const duration = 1200; // ms
              const delay = Math.round(duration / frames);

              const workerUrl = new URL('gif.js/dist/gif.worker.js', import.meta.url).href;
              const gif = new GIF({ workers: 2, quality: 10, workerScript: workerUrl });

              for (let i = 0; i < frames; i++) {
                await new Promise(r => setTimeout(r, delay));
                const canvas = await html2canvas(wrapper, { backgroundColor: '#ffffff', scale: 2 });
                gif.addFrame(canvas, { delay });
              }

              const result = await new Promise((res, rej) => {
                gif.on('finished', function(blob) { res(blob); });
                gif.on('abort', () => rej(new Error('GIF abort')));
                gif.on('error', (e) => rej(e));
                gif.render();
              });

              wrapper.remove();

              const url = URL.createObjectURL(result);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'mood-avatar.gif';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            } catch (e) {
              console.error('GIF capture error', e);
              alert('Erro ao gerar GIF: ' + (e.message || e));
            }
          }} title="Compartilhar avatar">
            <ShareIcon />
          </button>
        </div>
      </div>

      <div className="chat-intro">
        <span>Escreva como você está se sentindo. Este app registra seu humor visualmente e não substitui apoio profissional.</span>
        <span>As respostas usam análise local; se houver uma chave Gemini configurada, o app também adiciona uma camada extra de sensibilidade.</span>
      </div>

      {/* Avatar Central com Halo de Brilho Quente */}
      <div className={`avatar-stage${isDigesting ? ' avatar-digesting' : ''}`}>
        <AvatarRenderer avatarKey={avatarKey} stage={currentStage} />
      </div>

      {/* Arco de Humor Passivo (Passive Mood Arc da image_3.png) */}
      <PassiveMoodArc emaState={displayedEma} />

      {/* Mensagens de Chat */}
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="chat-empty">
            <span style={{fontSize: 28}}>💬</span>
            <span>Como você está se sentindo hoje?<br/>Compartilhe o que estiver em seu coração.</span>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Campo de Entrada (Borda Azul Pastel & Botão Lavanda) */}
      <div className="input-bar">
        <textarea
          ref={textareaRef}
          className="input-field"
          placeholder="Como você se sente?"
          value={inputText}
          onChange={adjustTextarea}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="send-btn" onClick={handleSend} title="Enviar">
          <SendIcon />
        </button>
      </div>
    </div>
  );
}

/* ─── Root App ───────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState(() => {
    const saved = localStorage.getItem('mc_avatar');
    return saved ? 'chat' : 'selection';
  });

  const [avatarKey, setAvatarKey] = useState(() => {
    return localStorage.getItem('mc_avatar') || 'flower';
  });

  const handleSelectAvatar = (key) => {
    setAvatarKey(key);
    localStorage.setItem('mc_avatar', key);
    localStorage.setItem('mc_onboarded', 'true');
    setScreen('chat');
  };

  const handleChangeAvatar = () => {
    setScreen('selection');
  };

  return (
    <div className="device-shell">
      {/* Status Bar Light Mode */}
      <div className="status-bar">
        <span className="status-bar-time">9:41</span>
        <div className="status-bar-icons">
          <svg viewBox="0 0 24 24"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
          <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="2" ry="2" fill="currentColor"/><path d="M22 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* Tela Ativa */}
      {screen === 'selection' ? (
        <SelectionScreen onSelect={handleSelectAvatar} />
      ) : (
        <ChatScreen avatarKey={avatarKey} onChangeAvatar={handleChangeAvatar} />
      )}

      {/* Home Indicator Bar */}
      <div className="home-indicator">
        <div className="home-indicator-bar" />
      </div>
    </div>
  );
}
