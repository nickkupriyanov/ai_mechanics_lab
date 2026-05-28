# ROADMAP.md — AI Mechanics Lab

## Project Stage

**Phases 1–7 + i18n + Agents/MCP/Memory are completed.**

The project has 9 interactive scenes, full Russian/English localization, 51+ unit tests, and SSG deployment-ready build.

Current strategic focus:

> Turn AI Mechanics Lab from a complete set of interactive scenes into a polished educational product ready for portfolio release.

Core product idea:

> Learn AI systems by breaking them.

---

## Completed

- [x] Phase 1–2 — Foundation: Next.js, Tailwind, layout, concept metadata
- [x] Phase 3 — RAG scene (full pipeline, 7 panels, 5 presets)
- [x] Phase 4 — Embeddings + Vector Search scenes
- [x] Phase 5 — Context Window scene
- [x] Phase 6 — Tool Calling scene
- [x] Phase 7 — Polish: responsive, 51 tests, animations, SEO
- [x] Full i18n: `next-intl`, 2 locales (ru/en), 300+ translation keys
- [x] Agents, MCP, Memory scenes (3 concepts, 12 components, 12 presets)
- [x] Prompt Injection scene (1 concept, 6 components, 4 presets)
- [x] Simulation data translated: documents, chat history, tool descriptions, memory snippets

## 11 Available Concepts

| # | Concept | Route | Level |
|---|---|---|---|
| 1 | Context Window | `/concepts/context-window` | knowledge |
| 2 | Embeddings | `/concepts/embeddings` | basics |
| 3 | Vector Search | `/concepts/vector-search` | basics |
| 4 | RAG | `/concepts/rag` | knowledge |
| 5 | Tool Calling | `/concepts/tool-calling` | agentic |
| 6 | Agents | `/concepts/agents` | agentic |
| 7 | Memory | `/concepts/memory` | agentic |
| 8 | MCP | `/concepts/mcp` | agentic |
| 9 | Prompt Injection | `/concepts/prompt-injection` | reliability |
| 10 | Evaluation | `/concepts/evaluation` | reliability |
| 11 | Guardrails | `/concepts/guardrails` | reliability |

---

## What Not To Do Yet

- Authentication, user accounts, database, backend
- Real OpenAI / Anthropic / LLM API calls
- CMS, payment, admin panel
- Complex gamification, analytics, social features

The project should remain frontend-first, deterministic, fast, and easy to demo.

---

# Phase 8 — Product Quality Audit

## Goal

Review the whole product as if you are a first-time user who does not already understand the project.

For every concept page, check:
1. Can the user understand the concept in 10 seconds?
2. Is it obvious what can be clicked, changed, or explored?
3. Does the scene clearly react when controls change?
4. Is there at least one failure mode?
5. Is there a "Show prompt" or "Show context" inspection panel?
6. Does the scene look polished?
7. Are edge values handled properly?

## Output

A structured audit list grouped by page — issues + improvements.

---

# Phase 9 — Improve Home Page Onboarding

## Goal

Make the home page immediately explain what the product is and how to use it.

### Required Sections

1. **Hero** — clear positioning: "Learn AI systems by breaking them"
2. **What is this?** — 2-3 sentence product explanation
3. **How to use it** — numbered steps (1-2-3-4)
4. **Recommended starting path** — suggested order with reasons
5. **Available concepts** — existing card grid
6. **Footer** — project description + Deerflow credit

---

# Phase 10 — Learning Path Navigation

## Goal

Turn the project from a flat list of concepts into a guided learning experience.

### Recommended Order (updated for 8 concepts)

```
Group 1 — AI App Basics
  1. Context Window — the model only sees what fits
  2. Tool Calling — how models use external tools

Group 2 — Knowledge Systems
  3. Embeddings — text as points in semantic space
  4. Vector Search — finding nearby meaning
  5. RAG — combining retrieval + generation

Group 3 — Agentic Systems
  6. Agents — looping with tools and reflection
  7. Memory — stored context across sessions
  8. MCP — standard bridge to external tools
```

### Implementation

- Add `order` field to concept metadata
- Add previous/next concept navigation on each concept page
- Show current position in learning path
- Group concepts on home page by category

---

# Phase 11 — «Try to Break It» Challenges (Future)

Invite users to cause failure modes with explicit challenges:

```
Try to break it:
- Can you make the answer worse by changing only topK?
- Can you overflow the context window?
```

---

# Phase 12 — Portfolio Release Polish (Future)

- About page (`/about`)
- README.md improvements
- SEO metadata polish
- Visual consistency audit
- Deploy to Vercel

---

# Phase 13+ — Future Concepts (Optional)

After the current 11 concepts are polished:
- **Real AI mode** — optional OpenAI/Anthropic API integration

---

## Priority Order

```
1.  Phase 8 — Product quality audit
2.  Phase 9 — Home page onboarding
3.  Phase 10 — Learning path navigation
4.  Phase 12 — Portfolio release (About, README, deploy)
5.  Phase 11 — Try to break it challenges
6.  Phase 13+ — Future concepts
```

---

## Product Quality Bar

The project is successful when a user can open it and say:

> I finally understand how this AI concept works because I changed something and saw the system react.

The final experience should feel like:
- an interactive AI systems lab
- a visual learning product
- a polished frontend portfolio project
- a practical explanation of real AI application mechanics
