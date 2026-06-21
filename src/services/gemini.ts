import {
  GoogleGenerativeAI,
  ChatSession,
  FunctionDeclaration,
  FunctionDeclarationSchema,
  FunctionDeclarationSchemaProperty,
  Content,
} from '@google/generative-ai';
import { MCPTool } from '../types';
import { callMCPTool } from './mcp';
import { GEMINI_MODEL, SYSTEM_PROMPT } from '../constants/agent';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

function sanitizeSchema(schema: Record<string, unknown>): FunctionDeclarationSchemaProperty {
  const { type, description, enum: enumValues, items, properties, required } = schema;

  const result: Record<string, unknown> = { type: (type as string) ?? 'string' };
  if (description) result.description = description;
  if (enumValues) {
    result.format = 'enum';
    result.enum = enumValues;
  }
  if (items) result.items = sanitizeSchema(items as Record<string, unknown>);
  if (properties) {
    result.properties = Object.fromEntries(
      Object.entries(properties as Record<string, unknown>).map(([key, value]) => [
        key,
        sanitizeSchema(value as Record<string, unknown>),
      ]),
    );
  }
  if (required) result.required = required;

  return result as unknown as FunctionDeclarationSchemaProperty;
}

function toFunctionDeclaration(tool: MCPTool): FunctionDeclaration {
  return {
    name: tool.name,
    description: tool.description,
    parameters: sanitizeSchema(tool.inputSchema) as FunctionDeclarationSchema,
  };
}

export function createChatSession(tools: MCPTool[]): ChatSession {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
    tools: [{ functionDeclarations: tools.map(toFunctionDeclaration) }],
  });
  return model.startChat();
}

export interface ToolCallHandler {
  (toolName: string, args: Record<string, unknown>): void;
}

export async function sendMessage(
  chat: ChatSession,
  message: string,
  onToolCall?: ToolCallHandler,
): Promise<string> {
  let result = await chat.sendMessage(message);
  let functionCalls = result.response.functionCalls();

  while (functionCalls && functionCalls.length > 0) {
    const responseParts: Content['parts'] = [];

    for (const call of functionCalls) {
      onToolCall?.(call.name, call.args as Record<string, unknown>);
      const toolResult = await callMCPTool(call.name, call.args as Record<string, unknown>);
      responseParts.push({
        functionResponse: {
          name: call.name,
          response: { result: toolResult },
        },
      });
    }

    result = await chat.sendMessage(responseParts);
    functionCalls = result.response.functionCalls();
  }

  return result.response.text();
}
