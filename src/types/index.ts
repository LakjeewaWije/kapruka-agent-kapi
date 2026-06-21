export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export type MessageRole = 'user' | 'assistant';
export type MessageType = 'text' | 'tool_call' | 'product_list' | 'checkout';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  type: MessageType;
  toolName?: string;
}
