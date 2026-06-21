import React, { useState, useRef } from 'react';
import { colors, gradients, shadows, fonts, radius } from '../../constants/theme';

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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
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
    <div style={{
      padding: '12px 16px 16px',
      backgroundColor: colors.bgCard,
      borderTop: `1px solid ${colors.border}`,
      boxShadow: shadows.inputBar,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        backgroundColor: colors.bgPage,
        border: `1.5px solid ${colors.border}`,
        borderRadius: radius.pill,
        padding: '6px 6px 6px 16px',
      }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Message Kapi..."
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontSize: fonts.sizeBase,
            fontFamily: fonts.family,
            lineHeight: fonts.lineHeight,
            maxHeight: 116,
            overflowY: 'auto',
            color: colors.textPrimary,
            paddingTop: 6,
            paddingBottom: 6,
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: 38, height: 38,
            borderRadius: radius.avatar,
            border: 'none',
            background: canSend ? gradients.sendButton : colors.bgSubtle,
            color: canSend ? colors.bgCard : colors.textMuted,
            fontSize: 16,
            cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.15s',
            boxShadow: canSend ? shadows.button : 'none',
          }}
        >
          ▶
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: fonts.sizeSm, color: colors.textMuted, margin: '8px 0 0' }}>
        Powered by Kapruka × Gemini
      </p>
    </div>
  );
}
