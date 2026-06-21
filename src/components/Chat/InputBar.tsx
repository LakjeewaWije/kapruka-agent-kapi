import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Suggestion {
  emoji: string;
  label: string;
}

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
  suggestions?: Suggestion[];
}

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

export default function InputBar({ onSend, disabled, suggestions = [] }: Props) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 116)}px`;
    }
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <div className="bg-white/80 backdrop-blur-sm border-t border-border px-4 pt-3 pb-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">

      {/* Suggestion chips */}
      {suggestions.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {suggestions.map(({ emoji, label }) => (
            <button
              key={label}
              onClick={() => onSend(label)}
              disabled={disabled}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-[#cbe3ff] bg-[#eef9ff] text-[#1995d3] hover:bg-[#1995d3] hover:text-white transition-colors duration-150 font-medium whitespace-nowrap"
            >
              <span>{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className={cn(
        'flex items-end gap-2.5 bg-[#f4f4f8] border rounded-2xl px-4 py-2 transition-colors',
        'border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10'
      )}>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask Kapi anything..."
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent text-[15px] min-h-[36px] max-h-[116px] leading-relaxed py-1 shadow-none focus-visible:ring-0 focus-visible:border-0 placeholder:text-muted-foreground/70"
        />
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className={cn(
            'shrink-0 size-9 rounded-xl mb-0.5 transition-all duration-150',
            canSend
              ? 'text-white shadow-[0_2px_10px_rgba(36,62,153,0.3)] hover:scale-105'
              : 'bg-muted text-muted-foreground'
          )}
          style={canSend ? { background: 'linear-gradient(135deg, #243e99, #1995d3)' } : {}}
        >
          <SendIcon />
        </Button>
      </div>

      <p className="text-center text-[11px] text-muted-foreground/60 mt-2">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
