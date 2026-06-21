import React, { useState } from 'react';
import { Message } from '../../types';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { colors, gradients, shadows, fonts, radius } from '../../constants/theme';
import { v4 as uuidv4 } from 'uuid';

const bgPattern = `
  radial-gradient(circle at 20% 50%, rgba(25,149,211,0.05) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(254,152,15,0.04) 0%, transparent 50%),
  radial-gradient(circle at 50% 80%, rgba(36,62,153,0.03) 0%, transparent 50%)
`;

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: "Hi! I'm Kapi 👋 Your AI shopping assistant for Kapruka.com.\n\nI can help you discover products, check delivery to your city, and guide you all the way to checkout. What are you looking for today?",
      type: 'text',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    const userMsg: Message = { id: uuidv4(), role: 'user', content: text, type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // placeholder — Gemini service wired up in next branch
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'assistant',
        content: "Got it! I'll be able to search Kapruka for you once the AI is connected in the next step.",
        type: 'text',
      }]);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .kapi-header { padding: 20px 16px !important; }
          .kapi-avatar { width: 52px !important; height: 52px !important; font-size: 22px !important; }
          .kapi-title { font-size: ${fonts.sizeLg}px !important; }
          .kapi-subtitle { font-size: 13px !important; }
        }
      `}</style>

      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: `${bgPattern}, ${colors.bgPage}` }}>

        <div className="kapi-header" style={{
          background: gradients.header,
          color: colors.bgCard,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          boxShadow: shadows.header,
          flexShrink: 0,
          zIndex: 10,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* glow blobs */}
          <div style={{
            position: 'absolute', top: '-50%', right: '8%',
            width: 160, height: 160, borderRadius: radius.avatar,
            background: 'rgba(254,152,15,0.22)', filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60%', left: '15%',
            width: 130, height: 130, borderRadius: radius.avatar,
            background: 'rgba(25,149,211,0.2)', filter: 'blur(35px)', pointerEvents: 'none',
          }} />

          <div className="kapi-avatar" style={{
            width: 42, height: 42, borderRadius: radius.avatar,
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '2px solid rgba(255,255,255,0.4)',
            color: colors.bgCard,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 18,
            boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
            position: 'relative', zIndex: 1,
          }}>K</div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="kapi-title" style={{ fontWeight: 700, fontSize: fonts.sizeMd, letterSpacing: 0.3 }}>Kapi</div>
            <div className="kapi-subtitle" style={{ fontSize: 12, opacity: 0.85 }}>AI Shopping Assistant · Kapruka.com</div>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 8, height: 8, borderRadius: radius.avatar, backgroundColor: colors.success, boxShadow: `0 0 8px ${colors.success}` }} />
            <span style={{ fontSize: 13, opacity: 0.9 }}>Online</span>
          </div>
        </div>

        <MessageList messages={messages} isLoading={isLoading} />
        <InputBar onSend={handleSend} disabled={isLoading} />
      </div>
    </>
  );
}
