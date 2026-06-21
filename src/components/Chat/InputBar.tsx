import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface Props {
  onSend: (text: string) => void;
  disabled: boolean;
}

export default function InputBar({ onSend, disabled }: Props) {
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
    <div className="px-4 pt-3 pb-4 bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className={cn(
        'flex items-end gap-2.5 bg-[#f4f4f8] border rounded-full px-4 py-1.5 transition-colors',
        'border-border focus-within:border-primary/50'
      )}>
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Message Kapi..."
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent text-[15px] min-h-[36px] max-h-[116px] leading-relaxed py-1.5 shadow-none focus-visible:ring-0 focus-visible:border-0 placeholder:text-muted-foreground"
        />
        <Button
          onClick={handleSend}
          disabled={!canSend}
          size="icon"
          className={cn(
            'shrink-0 size-[38px] rounded-full transition-all',
            canSend
              ? 'bg-primary hover:bg-primary/90 shadow-[0_2px_10px_rgba(36,62,153,0.35)]'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          )}
        >
          ▶
        </Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-2">
        Powered by Kapruka × Gemini
      </p>
    </div>
  );
}
