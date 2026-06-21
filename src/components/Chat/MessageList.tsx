import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-in fade-in duration-300">
      <div
        className="size-8 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ background: 'linear-gradient(135deg, #243e99, #1995d3)', boxShadow: '0 2px 8px rgba(36,62,153,0.25)' }}
      >
        K
      </div>
      <div className="bg-white border border-[#e5e5e5] px-4 py-3 shadow-sm flex gap-1.5 items-center" style={{ borderRadius: '20px 20px 20px 4px' }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="size-2 rounded-full bg-[#1995d3]/50 animate-bounce inline-block"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MessageList({ messages, isLoading }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <>
      <style>{`
        .message-scroll::-webkit-scrollbar { width: 4px; }
        .message-scroll::-webkit-scrollbar-track { background: transparent; }
        .message-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
        .message-scroll::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
      <div className="message-scroll flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>
    </>
  );
}
