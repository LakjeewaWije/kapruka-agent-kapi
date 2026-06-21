import { MCPTool } from '../types';

const MCP_ENDPOINT = 'https://mcp.kapruka.com/mcp';

let requestId = 1;
let sessionId: string | null = null;

function buildHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/event-stream',
  };
  if (sessionId) {
    headers['Mcp-Session-Id'] = sessionId;
  }
  return headers;
}

async function rpc(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
  const id = requestId++;
  const res = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
  });

  if (!sessionId) {
    const sid = res.headers.get('Mcp-Session-Id');
    if (sid) sessionId = sid;
  }

  const data = await res.json() as { result?: unknown; error?: { message: string } };
  if (data.error) throw new Error(`MCP error: ${data.error.message}`);
  return data.result;
}

async function notify(method: string, params: Record<string, unknown> = {}): Promise<void> {
  await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ jsonrpc: '2.0', method, params }),
  });
}

export async function initializeMCP(): Promise<void> {
  await rpc('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'kapruka-agent', version: '1.0.0' },
  });
  await notify('notifications/initialized');
}

export async function fetchMCPTools(): Promise<MCPTool[]> {
  const result = await rpc('tools/list') as { tools: Array<{ name: string; description: string; inputSchema?: Record<string, unknown> }> };
  return result.tools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema ?? {},
  }));
}

export async function callMCPTool(toolName: string, args: Record<string, unknown>): Promise<unknown> {
  const result = await rpc('tools/call', { name: toolName, arguments: args }) as { content?: unknown };
  return result.content ?? result;
}
