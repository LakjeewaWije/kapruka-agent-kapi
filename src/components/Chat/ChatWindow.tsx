import React, { useState } from 'react';
import { Message } from '../../types';
import MessageList from './MessageList';
import InputBar from './InputBar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { v4 as uuidv4 } from 'uuid';

const HEADER_GRADIENT = 'linear-gradient(135deg, #243e99 0%, #1995d3 55%, #FE980F 100%)';

const SUGGESTIONS = [
  { emoji: '🎁', label: 'Birthday gifts under LKR 5,000' },
  { emoji: '📱', label: 'Latest smartphones' },
  { emoji: '🚚', label: 'Delivery to Colombo' },
  { emoji: '🌸', label: 'Flowers & plants' },
  { emoji: '🍰', label: 'Cakes & desserts' },
];

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content: "Hi! I'm Kapi 👋 Your AI shopping assistant for Kapruka.com.\n\nI can help you discover products, check delivery to your city, and guide you all the way to checkout. What are you looking for today?",
  type: 'text',
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = (text: string) => {
    setMessages(prev => [...prev, { id: uuidv4(), role: 'user', content: text, type: 'text' }]);
    setIsLoading(true);

    // placeholder — Gemini wired up in next branch
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

  const showSuggestions = messages.length === 1;

  return (
    <div
      className="h-screen flex flex-col"
      style={{
        backgroundColor: '#f4f4f8',
        backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 py-3.5 shrink-0 z-10 relative overflow-hidden shadow-[0_4px_24px_rgba(36,62,153,0.35)] md:py-5"
        style={{ background: HEADER_GRADIENT }}
      >
        <div className="absolute -top-1/2 right-[8%] w-40 h-40 rounded-full blur-[40px] pointer-events-none bg-[#FE980F]/20" />
        <div className="absolute -bottom-1/2 left-[15%] w-32 h-32 rounded-full blur-[35px] pointer-events-none bg-[#1995d3]/20" />

        <Avatar className="size-[42px] md:size-[52px] border-2 border-white/40 bg-white/15 relative z-10 shrink-0">
          <AvatarFallback className="bg-white/15 text-white font-extrabold text-lg md:text-xl">K</AvatarFallback>
        </Avatar>

        <div className="relative z-10">
          <div className="font-bold text-[17px] md:text-xl text-white tracking-wide">Kapi</div>
          <div className="text-xs md:text-sm text-white/85">AI Shopping Assistant · Kapruka.com</div>
        </div>

        <div className="ml-auto flex items-center gap-1.5 relative z-10">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#73c367] opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-[#73c367]" />
          </span>
          <span className="text-sm text-white/90">Online</span>
        </div>
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      <InputBar
        onSend={handleSend}
        disabled={isLoading}
        suggestions={showSuggestions ? SUGGESTIONS : []}
      />
    </div>
  );
}
