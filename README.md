# AI Mechanics Lab

**Learn AI systems by breaking them.**

Interactive visual playground for understanding how modern AI systems work — RAG, embeddings, vector search, context windows, tool calling, agents, memory, and MCP.

## What it does

AI Mechanics Lab explains AI concepts through interactive simulations. Instead of reading definitions, you move sliders, change parameters, break the system, inspect prompts, and see how AI behavior changes.

Each concept includes:
- Interactive visual scene with real-time feedback
- Controls (sliders, toggles, buttons)
- Failure modes — ways the system can go wrong
- Presets that demonstrate healthy vs broken behavior
- Prompt/context preview to see what the model receives

## Available Concepts (8)

| # | Concept | What you'll learn |
|---|---|---|
| 1 | Context Window | The model only sees what fits in context |
| 2 | Tool Calling | How models select and use external tools |
| 3 | Embeddings | Text as points in semantic space |
| 4 | Vector Search | Nearest-neighbor retrieval |
| 5 | RAG | Retrieval-Augmented Generation pipeline |
| 6 | Agents | Goal-driven agent loops |
| 7 | Memory | Stored context across sessions |
| 8 | MCP | Standard bridge to external tools |

## Tech Stack

- **Next.js 16** (App Router, SSG)
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **Framer Motion** (animations)
- **Zustand** (state management)
- **next-intl** (i18n: EN + RU)
- **Vitest** (51 unit tests)

## Why simulations instead of real AI APIs

The MVP uses deterministic simulations — predefined documents, mock embeddings, scripted responses. This keeps the app fast, stable, free, and predictable. Real AI integrations can be added later as an optional "real mode."

## Product Principle

> Learn AI systems by breaking them.

Every concept includes at least one way to make the system fail — because understanding failures is often more valuable than understanding ideal behavior.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run test    # run 51 unit tests
npm run lint    # ESLint check
```

## Project Structure

```
src/
  app/[locale]/              # Pages (ru/en i18n)
  components/scenes/         # 8 interactive scenes
  components/shared/         # Reusable UI components
  components/layout/         # AppShell, Header, Sidebar
  lib/simulation/            # Deterministic simulation logic
  store/                     # Zustand state stores
  types/                     # TypeScript type definitions
  i18n/                      # next-intl routing config
messages/                    # Translation JSON (en.json, ru.json)
```

## License

MIT
