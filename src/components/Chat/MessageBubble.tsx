import React from 'react';
import { Message } from '../../types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const KapiAvatar = ({ size = 'sm' }: { size?: 'sm' | 'lg' }) => (
  <Avatar
    className={size === 'lg' ? 'size-10 shrink-0' : 'size-8 shrink-0'}
    style={{ background: 'linear-gradient(135deg, #243e99, #1995d3)', boxShadow: '0 2px 8px rgba(36,62,153,0.25)' }}
  >
    <AvatarFallback className="text-white font-bold bg-transparent" style={{ fontSize: size === 'lg' ? 16 : 13 }}>K</AvatarFallback>
  </Avatar>
);

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = formatTime(new Date());

  if (message.type === 'tool_call') {
    return (
      <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
        <KapiAvatar />
        <div className="flex items-center gap-2 bg-white border border-[#cbe3ff] rounded-2xl px-4 py-2.5 shadow-sm">
          <span className="size-1.5 rounded-full bg-[#1995d3] animate-pulse" />
          <span className="text-sm text-[#1995d3] font-medium">
            {toolLabels[message.toolName ?? ''] ?? '⚙️ Working...'}
          </span>
        </div>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-bottom-1 duration-300">
        <div
          className="max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-white shadow-[0_2px_12px_rgba(36,62,153,0.2)] rounded-[20px_20px_4px_20px]"
          style={{ background: 'linear-gradient(135deg, #243e99, #1995d3)' }}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-muted-foreground/70 mr-1">{time}</span>
      </div>
    );
  }

  // Special styling for the greeting message
  const isGreeting = message.id === 'greeting';

  return (
    <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <KapiAvatar size={isGreeting ? 'lg' : 'sm'} />
      <div className="flex flex-col gap-1 max-w-[75%]">
        {isGreeting && (
          <span className="text-xs font-semibold text-[#1995d3] ml-1 mb-0.5">Kapi</span>
        )}
        <div
          className="px-4 py-3 text-[15px] leading-relaxed break-words whitespace-pre-wrap bg-white text-[#222] shadow-sm border border-[#e5e5e5]"
          style={{ borderRadius: isGreeting ? '4px 20px 20px 20px' : '20px 20px 20px 4px' }}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-muted-foreground/70 ml-1">{time}</span>
      </div>
    </div>
  );
}
