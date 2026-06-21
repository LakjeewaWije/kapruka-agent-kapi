import React from 'react';
import { Message } from '../../types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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

const KapiAvatar = () => (
  <Avatar className="size-[34px] shrink-0 shadow-[0_2px_6px_rgba(36,62,153,0.3)]" style={{ background: 'linear-gradient(135deg, #243e99, #1995d3)' }}>
    <AvatarFallback className="text-white font-bold text-sm bg-transparent">K</AvatarFallback>
  </Avatar>
);

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const time = formatTime(new Date());

  if (message.type === 'tool_call') {
    return (
      <div className="flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <KapiAvatar />
        <span className="bg-[#eef9ff] border border-[#cbe3ff] text-[#1995d3] text-sm italic px-4 py-2 rounded-full">
          {toolLabels[message.toolName ?? ''] ?? '⚙️ Working...'}
        </span>
      </div>
    );
  }

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div
          className="max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-white shadow-[0_2px_10px_rgba(36,62,153,0.25)]"
          style={{
            background: 'linear-gradient(135deg, #243e99, #1995d3)',
            borderRadius: '20px 20px 4px 20px',
          }}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-muted-foreground mr-1">{time}</span>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <KapiAvatar />
      <div className={cn('flex flex-col gap-1')}>
        <div
          className="max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap bg-white text-[#222] shadow-sm border border-[#e5e5e5]"
          style={{ borderRadius: '20px 20px 20px 4px' }}
        >
          {message.content}
        </div>
        <span className="text-[11px] text-muted-foreground ml-1">{time}</span>
      </div>
    </div>
  );
}
