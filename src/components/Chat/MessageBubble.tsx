import React from 'react';
import { Message } from '../../types';
import { colors, gradients, shadows, fonts, radius } from '../../constants/theme';

interface Props {
  message: Message;
}

const toolLabels: Record<string, string> = {
  kapruka_search_products: '🔍 Searching products...',
  kapruka_get_product: '📦 Getting product details...',
  kapruka_list_categories: '🗂️ Loading categories...',
  kapruka_list_delivery_cities: '📍 Finding delivery cities...',
  kapruka_check_delivery: '🚚 Checking delivery...',
  kapruka_create_order: '🛒 Creating order...',
  kapruka_track_order: '📡 Tracking order...',
};

const fadeIn = `
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const avatarStyle: React.CSSProperties = {
  width: 34, height: 34, borderRadius: radius.avatar,
  background: gradients.avatar,
  color: colors.bgCard,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontWeight: 700, fontSize: fonts.sizeSm + 3, flexShrink: 0,
  boxShadow: shadows.avatar,
};

const timeStyle: React.CSSProperties = {
  fontSize: fonts.sizeSm, color: colors.textMuted, marginTop: 4,
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = formatTime(new Date());

  if (message.type === 'tool_call') {
    return (
      <>
        <style>{fadeIn}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, animation: 'fadeSlideIn 0.25s ease' }}>
          <div style={avatarStyle}>K</div>
          <div style={{
            backgroundColor: colors.primaryBg,
            borderRadius: radius.pill,
            padding: '8px 16px',
            fontSize: fonts.sizeSm + 2,
            color: colors.primary,
            fontStyle: 'italic',
            border: `1px solid ${colors.primaryBorder}`,
          }}>
            {toolLabels[message.toolName ?? ''] ?? '⚙️ Working...'}
          </div>
        </div>
      </>
    );
  }

  if (isUser) {
    return (
      <>
        <style>{fadeIn}</style>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', animation: 'fadeSlideIn 0.25s ease' }}>
          <div style={{
            maxWidth: '70%',
            padding: '11px 16px',
            fontSize: fonts.sizeBase,
            lineHeight: fonts.lineHeight,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            background: gradients.userBubble,
            color: colors.bgCard,
            borderRadius: `${radius.bubble}px ${radius.bubble}px 4px ${radius.bubble}px`,
            boxShadow: shadows.bubble,
          }}>
            {message.content}
          </div>
          <span style={{ ...timeStyle, marginRight: 4 }}>{time}</span>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{fadeIn}</style>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, animation: 'fadeSlideIn 0.25s ease' }}>
        <div style={avatarStyle}>K</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            maxWidth: '70%',
            padding: '11px 16px',
            fontSize: fonts.sizeBase,
            lineHeight: fonts.lineHeight,
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            backgroundColor: colors.bgCard,
            color: colors.textPrimary,
            borderRadius: `${radius.bubble}px ${radius.bubble}px ${radius.bubble}px 4px`,
            boxShadow: shadows.card,
            border: `1px solid ${colors.border}`,
          }}>
            {message.content}
          </div>
          <span style={{ ...timeStyle, marginLeft: 4 }}>{time}</span>
        </div>
      </div>
    </>
  );
}
