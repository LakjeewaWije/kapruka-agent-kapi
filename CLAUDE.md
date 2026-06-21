# Kapruka AI Shopping Agent — CLAUDE.md

## Project Overview
Kapruka Agent Challenge entry — application number KAC-H9RNTC.
Full-screen chat UI (Kapi) that uses the Kapruka MCP to let users browse, discover, and checkout products on Kapruka.com.

---

## Stack (CURRENT — post migration)
- **Vite** (not CRA) + React 19 + TypeScript strict
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — no `tailwind.config.js`, config is in `src/index.css`
- **shadcn/ui** — Base UI variant (not Radix). Components live in `src/components/ui/`
- `cn()` utility at `src/lib/utils.ts`
- Google Gemini Flash 2.0 (`gemini-2.0-flash`) via `@google/generative-ai`
- Kapruka MCP: `https://mcp.kapruka.com/mcp` (public, streamable HTTP, JSON-RPC 2.0)
- Jest + React Testing Library + ts-jest
- Deploy: Vercel

## Commands
```
npm start        # Vite dev server → http://localhost:5173
npm run build    # tsc && vite build
npm test         # jest
vercel --prod    # deploy
```

## Environment Variables
```
VITE_GEMINI_API_KEY=   ← NOTE: Vite prefix, NOT REACT_APP_
```

---

## Kapruka Brand Colors (defined in src/index.css :root)
```css
--kapruka-blue: #1995d3      /* primary */
--kapruka-navy: #243e99      /* dark/gradient start */
--kapruka-orange: #FE980F    /* accent/gradient end */
--kapruka-green: #73c367     /* success / online dot */
--kapruka-page-bg: #f4f4f8
```
shadcn `--primary` is overridden to `#1995d3` so `bg-primary` = Kapruka blue.
Header gradient: `linear-gradient(135deg, #243e99 0%, #1995d3 55%, #FE980F 100%)`

---

## What Is Already Built

### ✅ src/services/mcp.ts
JSON-RPC 2.0 client for the Kapruka MCP. Exports:
- `initializeMCP()` — handshake + session ID capture
- `fetchMCPTools()` → `MCPTool[]`
- `callMCPTool(name, args)` → `unknown`

### ✅ src/types/index.ts
- `Message` — id, role, content, type, toolName?
- `MCPTool` — name, description, inputSchema

### ✅ src/components/Chat/
- `ChatWindow.tsx` — full-screen layout, greeting, suggestion chips, dot-grid bg
- `MessageList.tsx` — scrollable, auto-scroll, typing indicator, custom scrollbar
- `MessageBubble.tsx` — user (navy→blue gradient), assistant (white card), tool_call (pulse dot), greeting (special)
- `InputBar.tsx` — suggestion chips, shadcn Textarea + Button, send SVG icon, keyboard hint

### ✅ src/constants/theme.ts
Still exists but largely superseded by Tailwind + CSS vars. Can be deleted later.

### ✅ src/components/ui/ (shadcn)
button, input, textarea, badge, avatar, card

---

## What Is NOT Yet Built (build order)
3. ~~Chat box UI~~ ✅
4. **`src/services/gemini.ts`** ← NEXT (new branch)
5. **`src/hooks/useConversation.ts` + `src/hooks/useChat.ts`** ← same branch as Gemini
6. `src/components/Products/ProductCard.tsx` + `ProductCarousel.tsx`
7. `src/components/Checkout/CheckoutSummary.tsx`
8. `src/utils/messageParser.ts`
9. `src/constants/agent.ts` (SYSTEM_PROMPT, AGENT_NAME, MCP_ENDPOINT)
10. Unit tests (`src/__tests__/`)

---

## Agent Personality
Name: **Kapi**
Tone: helpful, warm, Sri Lankan-aware
Knows: LKR currency, local occasions (Avurudu, Vesak, Christmas, birthdays)
Language: natural English, handle basic Sinhala input gracefully

## System Prompt (goes in src/constants/agent.ts)
```
You are Kapi, an AI shopping assistant for Kapruka.com — Sri Lanka's largest e-commerce platform.
Help customers discover products, check delivery, and complete purchases.
Always show products visually when search results are available.
Guide the user from discovery all the way through to checkout.
Be warm, helpful, and concise. Respond in the same language the user writes in.
When creating an order, always confirm details with the user before calling kapruka_create_order.
```

---

## MCP Integration Pattern (for Gemini service)
Gemini has no native MCP support — manual tool loop required:
1. `initializeMCP()` on app start
2. `fetchMCPTools()` → convert to Gemini `FunctionDeclaration[]`
3. Start Gemini chat with `systemInstruction` + `tools`
4. On `functionCall` response → `callMCPTool(name, args)` → feed back as `functionResponse`
5. Loop until Gemini returns plain text

## Available MCP Tools
- `kapruka_search_products` — search by keyword, category, price range
- `kapruka_get_product` — full product details by ID
- `kapruka_list_categories` — top-level categories
- `kapruka_list_delivery_cities` — search delivery locations
- `kapruka_check_delivery` — delivery availability + cost for city/date
- `kapruka_create_order` — guest checkout, returns click-to-pay URL
- `kapruka_track_order` — track order by number

---

## Key Types Still Needed (add to src/types/index.ts when building features)
```ts
Product       — id, name, price, currency, imageUrl, productUrl, inStock
CheckoutResult — payUrl, orderId, expiresAt
CartItem      — product, quantity
MCPToolCall   — toolName, args
MCPToolResult — toolName, result (unknown)
```
Message type will need `products?: Product[]` and `checkoutResult?: CheckoutResult` added when building product/checkout features.

---

## UI Behaviour
- Full-screen chat, no sidebars
- Product results → horizontal card carousel (image, name, LKR price)
- Tool calls → white card with animated blue pulse dot
- Checkout → card with Pay Now button → MCP-returned pay URL
- Suggestion chips disappear after first user message

## Judging Rubric (priority order)
1. Experience & polish — 30pts
2. Visual richness — 20pts
3. Personality — 15pts
4. Usefulness — 15pts
5. End-to-end checkout — 15pts
6. Creativity — 5pts

---

## Development Workflow — MUST FOLLOW
1. **One feature at a time** — show code to user, wait for approval before committing
2. **One commit per feature** — clear message, `npx tsc --noEmit` must pass first
3. **Branch strategy**: new feature branch per major feature group, PR to `main`
4. **No parallel agents building multiple features** — user must stay in control
5. **Current branch**: `main` (PR #1 merged). Start next feature on a new branch.

## Branch History
- `feature/ui-and-mcp` → PR #1 merged → MCP service + Chat UI + Vite migration + shadcn

## Folder Structure
```
src/
├── components/
│   ├── Chat/          ✅ ChatWindow, MessageList, MessageBubble, InputBar
│   ├── Products/      ❌ ProductCard, ProductCarousel (not built)
│   ├── Checkout/      ❌ CheckoutSummary (not built)
│   └── ui/            ✅ shadcn: button, input, textarea, badge, avatar, card
├── hooks/             ❌ useChat, useConversation (not built)
├── services/
│   ├── mcp.ts         ✅
│   └── gemini.ts      ❌ (not built)
├── types/index.ts     ✅ (partial — needs Product, CheckoutResult etc.)
├── utils/             ❌ messageParser (not built)
├── constants/         ❌ agent.ts (not built), theme.ts (built but largely unused)
├── lib/utils.ts       ✅ shadcn cn() utility
└── __tests__/         ❌ (not built)
```

## Deployment
- Vercel, auto-deploy from `main`
- Add `VITE_GEMINI_API_KEY` in Vercel project env vars
- No `vercel.json` needed
