import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic, CheckCheck } from 'lucide-react';

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isTyping, 
  activeCompanionName 
}) {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef(null);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden relative chat-wallpaper">
      
      {/* Messages Feed */}
      <div className="flex-1 px-5 py-3 overflow-y-auto chat-scroll-area space-y-3">
        
        {/* WhatsApp Centered Date Badge */}
        <div className="flex justify-center my-2">
          <span className="text-[11px] font-semibold text-[#8696a0] bg-[#182229] px-3 py-1 rounded-lg uppercase tracking-wider shadow-sm">
            HOJE
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#8696a0]">
            <div className="bg-[#182229] p-4 rounded-2xl border border-[#222d34] max-w-xs">
              <p className="text-xs font-medium text-[#d1d7db]">Sua conversa é encriptada com carinho.</p>
              <p className="text-[11px] text-[#8696a0] mt-1">
                Suas palavras funcionam como água que rega seu {activeCompanionName}. Escreva como foi seu dia!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} my-1`}
            >
              {/* WhatsApp Message Bubble */}
              <div 
                className={`max-w-[82%] px-3.5 py-2 text-xs sm:text-sm leading-relaxed rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bubble-user'
                    : 'bubble-companion'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {/* Bubble Timestamp & Read Receipt Checkmarks */}
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] mt-1 select-none">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] inline-block" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* WhatsApp Typing / Absorbing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-[#8696a0] text-xs bg-[#202c33] px-3.5 py-2.5 rounded-2xl bubble-companion w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00a884] animate-ping" />
            <span className="text-[#d1d7db]">{activeCompanionName} está digitando...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* WhatsApp Input Bar */}
      <form onSubmit={handleSubmit} className="px-3 py-3 bg-[#202c33] border-t border-[#111b21] flex items-center gap-2">
        
        {/* Emoji Icon */}
        <button 
          type="button" 
          className="text-[#8696a0] hover:text-[#d1d7db] p-1.5 transition-colors"
          title="Emojis"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Paperclip Attachment Icon */}
        <button 
          type="button" 
          className="text-[#8696a0] hover:text-[#d1d7db] p-1.5 transition-colors"
          title="Anexar"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* WhatsApp Pill Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Como você está se sentindo?"
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#2a3942] border border-[#313d45] focus:outline-none focus:border-[#00a884] text-[#e9edef] placeholder-[#8696a0] transition-colors"
        />

        {/* WhatsApp Send Button or Mic Button */}
        {inputText.trim() ? (
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md transition-all flex items-center justify-center flex-shrink-0 active:scale-95"
            title="Enviar mensagem"
          >
            <Send className="w-4 h-4 fill-current transform translate-x-0.5" />
          </button>
        ) : (
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-md transition-all flex items-center justify-center flex-shrink-0"
            title="Mensagem de voz"
          >
            <Mic className="w-4 h-4" />
          </button>
        )}
      </form>

    </div>
  );
}
