# Kapruka AI Shopping Agent — CLAUDE.md

## Project Overview
Kapruka Agent Challenge entry — application number KAC-H9RNTC.
Full-screen chat UI that uses the Kapruka MCP to let users browse, discover, and checkout products on Kapruka.com.

## Stack
- React (CRA) with TypeScript template
- Google Gemini Flash 2.0 (`gemini-2.0-flash`) via `@google/generative-ai`
- Kapruka MCP: `https://mcp.kapruka.com/mcp` (no auth, public, streamable HTTP)
- Jest + React Testing Library + ts-jest
- Deploy: Vercel

## Folder Structure
src/
├── components/
│   ├── Chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputBar.tsx
│   ├── Products/
│   │   ├── ProductCard.tsx
│   │   └── ProductCarousel.tsx
│   ├── Checkout/
│   │   └── CheckoutSummary.tsx
│   └── ui/
│       ├── Spinner.tsx
│       └── Badge.tsx
├── hooks/
│   ├── useChat.ts
│   └── useConversation.ts
├── services/
│   ├── gemini.ts
│   └── mcp.ts
├── types/
│   └── index.ts          # all shared interfaces and types
├── utils/
│   └── messageParser.ts
├── constants/
│   └── agent.ts
└── __tests__/
    ├── components/
    │   ├── ProductCard.test.tsx
    │   └── MessageBubble.test.tsx
    ├── hooks/
    │   └── useChat.test.ts
    └── utils/
        └── messageParser.test.ts

## Environment Variables
REACT_APP_GEMINI_API_KEY= (get free key from aistudio.google.com)

## Commands
npm start        # dev server
npm test         # jest
npm run build    # production build
vercel --prod    # deploy

## TypeScript
- Strict mode on
- All shared types and interfaces live in src/types/index.ts
- No `any` — use `unknown` and narrow properly
- Props interfaces defined in the same file as the component

## Key Types (define in src/types/index.ts)
- Message — id, role ('user' | 'assistant'), content, type ('text' | 'tool_call' | 'product_list' | 'checkout')
- Product — id, name, price, currency, imageUrl, productUrl, inStock
- MCPTool — name, description, inputSchema
- MCPToolCall — toolName, args
- MCPToolResult — toolName, result (unknown)
- CartItem — product, quantity
- Order — recipient, delivery, cart, giftMessage
- CheckoutResult — payUrl, orderId, expiresAt

## AI Provider
Google Gemini Flash 2.0 via `@google/generative-ai` SDK.
Model: `gemini-2.0-flash`
Free tier — no cost.

## MCP Integration
Gemini has no native MCP support. Implement a manual tool loop in src/services/mcp.ts and src/services/gemini.ts:

1. On app init: fetch tool definitions from https://mcp.kapruka.com/mcp
2. Convert MCP JSON schema → Gemini FunctionDeclaration format
3. Send to Gemini with tools array
4. On functionCall response: POST the tool call back to the MCP endpoint
5. Feed the result back as functionResponse
6. Loop until Gemini returns a plain text response

MCP transport is Streamable HTTP. Tool calls are standard JSON-RPC POST requests to https://mcp.kapruka.com/mcp.

## Available MCP Tools
- kapruka_search_products — search catalog by keyword, category, price range
- kapruka_get_product — full product details by ID
- kapruka_list_categories — top-level categories
- kapruka_list_delivery_cities — search delivery locations
- kapruka_check_delivery — check delivery availability + cost for a city/date
- kapruka_create_order — create guest checkout order, returns click-to-pay URL
- kapruka_track_order — track existing order by order number

## Agent Personality
Name: "Kapi"
Tone: helpful, warm, Sri Lankan-aware
Knows: LKR currency, local occasions (Avurudu, Vesak, Christmas, birthdays)
Language: natural English, handle basic Sinhala input gracefully

## System Prompt (in src/constants/agent.ts)
You are Kapi, an AI shopping assistant for Kapruka.com — Sri Lanka's largest e-commerce platform.
Help customers discover products, check delivery, and complete purchases.
Always show products visually when search results are available.
Guide the user from discovery all the way through to checkout.
Be warm, helpful, and concise. Respond in the same language the user writes in.
When creating an order, always confirm details with the user before calling kapruka_create_order.

## UI Behaviour
- Full screen chat layout — no sidebars, no widgets
- Product results render as horizontal card carousels (image, name, price in LKR)
- Tool calls show a "Searching..." / "Checking delivery..." skeleton state
- Checkout summary shows order details + a prominent "Pay Now" button linking to the MCP-returned pay URL
- Message bubbles: user on right, Kapi on left with avatar

## Judging Rubric (build priority order)
1. Experience & polish — 30pts — smooth, fast, beautiful UI
2. Visual richness — 20pts — product images, cards, carousels
3. Personality — 15pts — Kapi feels alive, not robotic
4. Usefulness — 15pts — actually helps user find and buy something
5. End-to-end checkout — 15pts — full flow from search to pay link
6. Creativity — 5pts — surprise the judges

## Out of Scope
- User auth
- Persistent cart (session memory only)
- Real payment processing (MCP returns a pay link, render it as a button)

## Testing Scope
Unit tests only:
- ProductCard renders correctly
- MessageBubble handles text and tool states
- messageParser correctly extracts product data from tool results
- useChat manages message state correctly (mock Gemini + MCP)

## Deployment
- Vercel, automatic from main branch
- Add REACT_APP_GEMINI_API_KEY in Vercel project environment variables
- No vercel.json config needed for CRA