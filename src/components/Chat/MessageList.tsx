import React, { useEffect, useRef } from 'react';
import { Message } from '../../types';
import MessageBubble from './MessageBubble';

interface Props {
  messages: Message[];
  isLoading: boolean;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 animate-in fade-in duration-200">
      <div
        className="size-[34px] shrink-0 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-[0_2px_6px_rgba(36,62,153,0.3)]"
        style={{ background: 'linear-gradient(135deg, #243e99, #1995d3)' }}
      >
        K
      </div>
      <div className="bg-white border border-[#e5e5e5] rounded-[20px_20px_20px_4px] px-4 py-3 shadow-sm flex gap-1 items-center">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="size-[7px] rounded-full bg-muted-foreground/50 animate-bounce"
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
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
