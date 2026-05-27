# AGENTS.md — AI Mechanics Lab

## Project Summary

AI Mechanics Lab is an interactive educational web app that explains modern AI concepts visually.

The goal is not to build another text-based AI glossary. The goal is to help users understand AI systems by interacting with small visual scenes, changing parameters, breaking the system, and seeing why behavior changes.

Core idea:

> Learn AI systems by breaking them.

Users should be able to understand concepts like RAG, embeddings, vector search, context window, tool calling, agents, MCP, and memory through interactive simulations.

The project is primarily aimed at frontend, fullstack, and product-oriented developers who want to understand how AI applications actually work.

---

## Product Principles

### 1. Visual first

Every concept should be explained through an interactive visual scene, not only through text.

Bad:

```txt
RAG is Retrieval-Augmented Generation...
````

Good:

```txt
Documents → Chunking → Embeddings → Vector DB → Retrieval → Context → Answer
```

The user should see how information moves through the system.

---

### 2. Interactive, not passive

Each scene should include controls:

* sliders;
* toggles;
* buttons;
* presets;
* step-by-step playback;
* failure modes.

The user should be able to change something and immediately see what happens.

---

### 3. Explain by breaking

Each concept should include at least one way to make the system fail.

Examples:

* bad chunk size breaks RAG;
* low topK misses relevant chunks;
* too much noise pollutes context;
* vague tool descriptions cause wrong tool selection;
* context overflow removes important instructions;
* stale memory causes bad personalization.

The project should teach not only how AI systems work, but also why they fail.

---

### 4. Simulate first, real AI later

For MVP, do not depend on real LLM APIs.

Use deterministic simulations:

* predefined documents;
* mock embeddings;
* fake similarity scores;
* simple token counting;
* scripted model responses;
* deterministic tool selection scoring.

This keeps the app:

* fast;
* stable;
* cheap;
* easier to demo;
* easier to test.

Real AI integrations can be added later as an optional "real mode".

---

### 5. Show what the model sees

Whenever possible, include a "Show prompt" or "Show context" panel.

Users should be able to inspect:

* system prompt;
* user request;
* retrieved chunks;
* tool results;
* memory snippets;
* final context sent to the model.

This is one of the most important educational features.

---

## Target Audience

Primary audience:

* frontend developers;
* fullstack developers;
* beginner AI engineers;
* developers learning agentic development.

Secondary audience:

* product managers;
* designers of AI products;
* technical founders;
* people trying to understand modern AI concepts without heavy math.

Do not write the app like an academic paper. The tone should be clear, practical, visual, and developer-friendly.

---

## Preferred Stack

Use:

* Next.js
* TypeScript
* React
* Tailwind CSS
* shadcn/ui where useful
* Framer Motion for animations
* Zustand for interactive scene state if needed
* MDX or structured content files for concept explanations
* SVG/Canvas/React components for visual scenes
* React Flow only when node-based diagrams become complex enough

Avoid:

* unnecessary backend for MVP;
* real LLM API dependency in MVP;
* over-engineered global state;
* heavy animation libraries unless needed;
* complex data fetching unless the scene needs it.

---

## MVP Scope

The MVP should include:

1. Home page
2. Concept navigation
3. RAG scene
4. Embeddings scene
5. Vector Search scene
6. Context Window scene
7. Tool Calling scene

Agents, MCP, Memory, Evaluation, Guardrails, and Prompt Injection are future expansion topics.

The first vertical slice should be the RAG scene.

---

## Core Concepts

### MVP Concepts

#### RAG

Explain how documents become context for the model.

Pipeline:

```txt
Documents → Chunking → Embeddings → Vector DB → Retrieval → Context → LLM Answer
```

Required interactions:

* change chunk size;
* change topK;
* add noise documents;
* change context limit;
* enable/disable reranking if implemented;
* show retrieved chunks;
* show final context;
* show final answer.

Failure modes:

* chunk too large;
* chunk too small;
* topK too low;
* topK too high;
* noisy retrieval;
* context overflow;
* outdated document retrieved.

---

#### Embeddings

Explain how text can be represented as points in semantic space.

Required interactions:

* add sample phrase;
* select two phrases and show distance;
* toggle "keyword similarity" vs "semantic similarity";
* show clusters;
* optionally add noise.

Failure modes:

* similar words but different meaning;
* different words but similar meaning;
* ambiguous phrase.

---

#### Vector Search

Explain nearest-neighbor retrieval.

Required interactions:

* enter/select a query;
* show query point;
* show nearest documents/chunks;
* adjust topK;
* adjust similarity threshold;
* show similarity scores.

Failure modes:

* relevant item below threshold;
* topK too small;
* topK too large;
* semantically close but practically useless result.

---

#### Context Window

Explain that the model only sees what fits into the current context.

Required interactions:

* add chat history;
* add retrieved documents;
* add tool results;
* add noise;
* change context size;
* enable summarization;
* inspect final prompt.

Failure modes:

* important instruction pushed out;
* current user request buried;
* too much retrieved context;
* irrelevant history included.

---

#### Tool Calling

Explain how a model selects predefined tools and passes arguments.

Required interactions:

* select a user request;
* show available tools;
* show selected tool;
* show JSON arguments;
* show tool result;
* enable/disable human approval;
* simulate tool error.

Failure modes:

* bad tool description;
* missing required fields;
* similar tools confuse selection;
* dangerous side effect without approval;
* tool returns error.

---

## Future Concepts

### Agents

Explain the agent loop:

```txt
Goal → Plan → Tool Call → Observation → Reflection → Next Step → Final Answer
```

Important controls:

* max steps;
* enable reflection;
* enable memory;
* enable approval;
* tool reliability;
* stop condition.

Failure modes:

* infinite loop;
* vague goal;
* wrong tool;
* bad observation;
* no stop condition.

---

### MCP

Explain MCP as a standard bridge between AI clients and external tools/data sources.

Visual model:

```txt
AI Client → MCP Server → External System
```

Examples:

* GitHub MCP;
* filesystem MCP;
* database MCP;
* Figma MCP;
* Google Drive MCP.

Core message:

MCP does not make the model magical. It gives the AI application a standardized way to discover and use external capabilities.

---

### Memory

Explain the difference between memory and context.

Core message:

Memory is stored information that may later be retrieved and inserted into the current context. It is not the same as the model permanently knowing something.

Required ideas:

* save memory;
* retrieve memory;
* show what memory enters the prompt;
* delete memory;
* stale memory;
* irrelevant memory.

---

## Information Architecture

Recommended structure:

```txt
src/
  app/
    page.tsx
    concepts/
      [slug]/
        page.tsx

  content/
    concepts/
      rag.mdx
      embeddings.mdx
      vector-search.mdx
      context-window.mdx
      tool-calling.mdx

  components/
    layout/
      AppShell.tsx
      Header.tsx
      Sidebar.tsx
      ConceptNavigation.tsx

    scenes/
      rag/
        RagScene.tsx
        RagPipeline.tsx
        DocumentsPanel.tsx
        ChunkingVisualizer.tsx
        VectorDbVisualizer.tsx
        RetrievalPanel.tsx
        ContextPanel.tsx
        AnswerPanel.tsx
        RagControls.tsx

      embeddings/
        EmbeddingsScene.tsx
        SemanticMap.tsx
        PhraseList.tsx
        DistanceInspector.tsx
        EmbeddingsControls.tsx

      vector-search/
        VectorSearchScene.tsx
        QueryPoint.tsx
        SearchResults.tsx
        SimilarityControls.tsx

      context-window/
        ContextWindowScene.tsx
        TokenBlock.tsx
        ContextMeter.tsx
        PromptPreview.tsx
        ContextControls.tsx

      tool-calling/
        ToolCallingScene.tsx
        ToolList.tsx
        ToolSelectionPanel.tsx
        ToolArgumentsPanel.tsx
        ToolResultPanel.tsx
        ToolCallingControls.tsx

    ui/
      // shadcn/ui components

    shared/
      SceneShell.tsx
      ExplanationPanel.tsx
      ControlPanel.tsx
      PresetSelector.tsx
      FailureModeCard.tsx
      PromptPreview.tsx

  lib/
    concepts.ts
    simulation/
      chunking.ts
      retrieval.ts
      embeddings.ts
      token-counter.ts
      tool-selection.ts
      context-window.ts

  store/
    rag-store.ts
    embeddings-store.ts
    vector-search-store.ts
    context-window-store.ts
    tool-calling-store.ts

  types/
    concept.ts
    scenes.ts
```

Keep the architecture simple. Do not create folders before they are needed.

---

## Page Structure

Each concept page should follow this structure:

```txt
Title
One-line explanation
Interactive Scene
Controls
What is happening
Why it matters
How it breaks
Real-world usage
Show prompt/context
```

Example:

```txt
RAG

RAG lets an AI system answer using external documents.

[Interactive scene]

What is happening:
1. Documents are split into chunks.
2. Each chunk gets embedded.
3. The user question is embedded.
4. Similar chunks are retrieved.
5. Retrieved chunks are inserted into the model context.
6. The model answers using that context.

How it breaks:
- bad chunks;
- noisy retrieval;
- outdated documents;
- context overflow.
```

---

## UI Direction

The interface should feel like:

* clean technical playground;
* visual lab;
* interactive diagram;
* modern developer tool;
* calm educational product.

Use:

* clean layouts;
* soft grid backgrounds;
* cards;
* subtle borders;
* clear spacing;
* readable typography;
* smooth transitions;
* restrained accent colors;
* node-like diagrams;
* token-like pills.

Avoid:

* glassmorphism;
* noisy gradients;
* overloaded dashboards;
* childish gamification;
* excessive neon/cyberpunk styling;
* walls of text;
* random decorative illustrations that do not explain the concept.

---

## Layout Pattern

Preferred concept layout:

```txt
┌─────────────────────────────────────────────┐
│ Header                                      │
├───────────────┬─────────────────────────────┤
│ Sidebar       │ Scene                       │
│ Concepts      │                             │
│               │                             │
│               │                             │
├───────────────┴───────────────┬─────────────┤
│ Explanation                   │ Controls    │
└───────────────────────────────┴─────────────┘
```

On smaller screens:

```txt
Title
Scene
Controls
Explanation
Related concepts
```

All scenes must be usable on desktop first. Mobile support should be acceptable, but the project is primarily a desktop learning playground.

---

## Design Rules

### Typography

Use clear, readable typography.

Prefer:

* concise headings;
* short paragraphs;
* code-like labels for technical entities;
* small explanatory hints near controls.

Avoid large blocks of dense text inside scene components.

---

### Animation

Use animation to explain state transitions, not just for decoration.

Good animation examples:

* chunk moves into vector DB;
* query point searches nearby chunks;
* context window fills up;
* old blocks get pushed out;
* selected tool is highlighted;
* tool result returns to the model.

Bad animation examples:

* random floating shapes;
* excessive background motion;
* animations that slow down learning.

---

### Controls

Controls should be explicit and educational.

Bad:

```txt
Slider: 300
```

Good:

```txt
Chunk size: 300 tokens
Small chunks improve precision, but may lose context.
```

Each important control should have a short explanation.

---

## Simulation Rules

### Do not pretend mock data is real

If data is simulated, the UI should make that clear where needed.

Use labels like:

```txt
Simulated retrieval
Mock vector space
Example prompt
Estimated token count
```

---

### Keep simulations deterministic

For MVP, avoid random behavior unless it is controlled by a seed or explicit user action.

This makes demos and tests predictable.

---

### Prefer understandable approximations

The goal is not mathematical perfection. The goal is conceptual clarity.

For example:

* a 2D embedding map is acceptable even though real embeddings are high-dimensional;
* simple similarity scores are acceptable;
* estimated token counts are acceptable;
* scripted LLM answers are acceptable.

But do not write misleading explanations. Always clarify when something is simplified.

---

## Content Style

Write in simple, direct language.

Tone:

* practical;
* clear;
* calm;
* slightly opinionated;
* developer-friendly.

Avoid:

* hype;
* vague claims;
* academic overcomplication;
* marketing language;
* unexplained jargon.

Each concept should answer:

1. What is it?
2. Why does it exist?
3. How does it work?
4. What can go wrong?
5. Where is it used in real products?

---

## Example Concept Copy Style

Good:

```txt
RAG does not make the model permanently know your documents.

Instead, the app searches your documents, selects relevant chunks, and places them into the model's current context.
```

Bad:

```txt
RAG is a cutting-edge paradigm that enhances generative capabilities through retrieval-based augmentation.
```

---

## Component Rules

### Scene components

Scene components should be split into:

* main scene container;
* visual diagram components;
* control components;
* data/simulation logic.

Avoid putting all logic and UI into one giant component.

Bad:

```txt
RagScene.tsx with 800 lines
```

Good:

```txt
RagScene.tsx
RagPipeline.tsx
ChunkingVisualizer.tsx
RetrievalPanel.tsx
ContextPanel.tsx
RagControls.tsx
```

---

### Shared components

Create shared components only when reuse is real.

Good shared components:

* `SceneShell`
* `ControlPanel`
* `PresetSelector`
* `PromptPreview`
* `FailureModeCard`
* `TokenMeter`

Avoid premature abstractions.

---

### State management

Use local React state for simple scenes.

Use Zustand only when:

* multiple distant components need the same state;
* state transitions become complex;
* presets need to modify many values at once.

Do not create global state for static content.

---

## TypeScript Rules

Use TypeScript strictly.

Prefer explicit domain types.

Example:

```ts
type ConceptSlug =
  | "rag"
  | "embeddings"
  | "vector-search"
  | "context-window"
  | "tool-calling";

type RetrievedChunk = {
  id: string;
  documentId: string;
  text: string;
  score: number;
  tokens: number;
  isRelevant: boolean;
};
```

Avoid `any`.

If a type is uncertain, use `unknown` and narrow it properly.

---

## Data Modeling

Concept metadata example:

```ts
export type Concept = {
  slug: string;
  title: string;
  shortDescription: string;
  level: "basics" | "knowledge" | "agentic" | "reliability";
  status: "available" | "planned";
  relatedConcepts: string[];
};
```

Scene preset example:

```ts
export type ScenePreset = {
  id: string;
  title: string;
  description: string;
  apply: () => void;
};
```

RAG settings example:

```ts
export type RagSettings = {
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  contextLimit: number;
  noiseLevel: number;
  rerankingEnabled: boolean;
};
```

---

## Accessibility

Interactive scenes must remain understandable and usable.

Requirements:

* buttons have accessible labels;
* sliders have visible labels and values;
* color is not the only way to communicate status;
* important changes should also be represented in text;
* keyboard navigation should work for main controls;
* text contrast should be acceptable.

Do not build a purely visual experience that cannot be understood without color or motion.

---

## Performance

The app should feel instant.

Rules:

* avoid unnecessary re-renders in animated scenes;
* memoize expensive derived data if needed;
* keep mock datasets small;
* lazy-load heavy scenes if needed;
* avoid shipping large libraries for one small visual effect.

For MVP, prioritize clarity over extreme optimization.

---

## SEO

The project should be indexable and useful as a public portfolio project.

Each concept page should have:

* unique title;
* meta description;
* readable static explanation;
* clean URL;
* Open Graph metadata if convenient.

Example URLs:

```txt
/concepts/rag
/concepts/embeddings
/concepts/vector-search
/concepts/context-window
/concepts/tool-calling
```

---

## Testing

Minimum testing expectations:

* simulation functions should be unit-testable;
* key utility functions should have tests;
* UI should not crash when controls reach min/max values.

Important functions to test:

```txt
chunkDocument()
retrieveTopK()
estimateTokens()
buildPromptPreview()
selectTool()
calculateSimilarity()
```

Do not over-test animation details.

---

## Definition of Done

A feature is done when:

* it works visually;
* it has meaningful interaction;
* it has a clear explanation;
* it includes at least one failure mode;
* it handles edge values;
* it looks consistent with the rest of the app;
* it is typed properly;
* it does not introduce unnecessary dependencies;
* it does not rely on real AI APIs unless explicitly required;
* it is understandable without reading the source code.

For concept scenes, done means:

```txt
User can interact with the concept, break it, and explain back the core idea after using the scene.
```

---

## RAG Scene Requirements

The RAG scene is the first priority.

It should include:

### Panels

* Documents panel
* Chunking panel
* Vector DB panel
* Retrieval results panel
* Context window panel
* Answer panel
* Controls panel

### Required controls

* chunk size;
* topK;
* context limit;
* noise level;
* preset selector.

### Required presets

```txt
Good RAG
Bad chunking
TopK too low
Too much noise
Context overflow
```

### Required educational outputs

* retrieved chunks;
* similarity scores;
* context token usage;
* final prompt preview;
* simulated answer;
* explanation of current failure mode if any.

### Required behavior

When settings change, the scene should update immediately.

The user should be able to see:

* how many chunks were created;
* which chunks were retrieved;
* which chunks fit into context;
* which chunks were excluded;
* why the answer quality changes.

---

## Embeddings Scene Requirements

The Embeddings scene should include:

* semantic map;
* phrase list;
* selected phrase inspector;
* distance between two phrases;
* clusters by topic.

Use predefined example phrases.

Example topics:

* travel;
* programming;
* AI;
* cooking;
* productivity.

The scene should explain that real embeddings are not 2D, but 2D is used as a simplified visualization.

---

## Vector Search Scene Requirements

The Vector Search scene should include:

* documents/chunks on a map;
* query point;
* nearest neighbors;
* similarity scores;
* topK control;
* threshold control.

The user should understand that vector search retrieves similar items, not guaranteed correct answers.

---

## Context Window Scene Requirements

The Context Window scene should include:

* visual token meter;
* blocks for system prompt, history, retrieved docs, tools, memory, and current request;
* context size control;
* add noise control;
* summarization toggle;
* prompt preview.

The scene should clearly show when important content gets pushed out or excluded.

---

## Tool Calling Scene Requirements

The Tool Calling scene should include:

* user request;
* available tools;
* tool descriptions;
* selected tool;
* generated JSON arguments;
* tool result;
* final model response.

Required controls:

* good/bad tool descriptions;
* approval on/off;
* tool error on/off;
* similar tools on/off.

The scene should explain that the model does not execute actions by itself. The application executes the selected tool.

---

## Naming

Preferred project name:

```txt
AI Mechanics Lab
```

Alternative name:

```txt
AI Concepts Visualizer
```

Use `AI Mechanics Lab` in UI unless the product name is changed explicitly.

Suggested tagline:

```txt
Understand AI systems by interacting with them.
```

Alternative tagline:

```txt
Learn AI systems by breaking them.
```

---

## Copywriting Rules

Use short, strong explanations.

Prefer:

```txt
The model only sees what fits into the context.
```

Instead of:

```txt
The context window represents the bounded sequence of tokens available to the model at inference time.
```

Prefer:

```txt
Vector search finds nearby meaning, not guaranteed truth.
```

Instead of:

```txt
Vector search performs approximate nearest-neighbor retrieval over embedded representations.
```

Technical terms are allowed, but they must be explained visually or with a simple example.

---

## Do Not Build Yet

Do not build these in MVP unless explicitly requested:

* user accounts;
* auth;
* backend;
* database;
* real OpenAI/Anthropic API calls;
* payment;
* progress sync;
* admin panel;
* CMS;
* complex gamification;
* comments;
* community features.

Local state is enough for MVP.

---

## Suggested Development Order

### Phase 1 — Foundation

* Create Next.js project
* Set up TypeScript
* Set up Tailwind
* Add base layout
* Add home page
* Add concept metadata
* Add concept route
* Add placeholder concept pages

### Phase 2 — Design System

* Create app shell
* Create sidebar
* Create scene shell
* Create control panel
* Create shared card components
* Create prompt preview component
* Create failure mode component

### Phase 3 — RAG Scene

* Add mock documents
* Implement chunking simulation
* Implement retrieval simulation
* Implement context limit simulation
* Add RAG controls
* Add presets
* Add prompt preview
* Add answer panel
* Add failure mode explanations

### Phase 4 — Embeddings and Vector Search

* Add semantic map
* Add mock embedding points
* Add distance calculation
* Add topK and threshold interactions
* Add explanation panels

### Phase 5 — Context Window

* Add token blocks
* Add context meter
* Add overflow logic
* Add summarization toggle
* Add prompt preview

### Phase 6 — Tool Calling

* Add mock tools
* Add request examples
* Add tool scoring
* Add JSON arguments
* Add approval step
* Add error state

### Phase 7 — Polish

* Improve animations
* Improve responsive layout
* Add SEO metadata
* Add empty/error states
* Add tests for simulation logic
* Add final copy pass

---

## Agent Behavior Rules

When working on this project:

1. Prefer completing one vertical slice over touching many unrelated files.
2. Keep the app working after every meaningful change.
3. Do not introduce real AI API calls unless explicitly requested.
4. Do not add backend infrastructure for MVP.
5. Do not add authentication.
6. Do not overcomplicate state management.
7. Use deterministic mock data.
8. Keep visual explanations clear and minimal.
9. Every new scene must have controls and a failure mode.
10. Every technical concept must include a simple explanation.
11. If adding a dependency, justify why it is needed.
12. Prefer small reusable components over giant scene files.
13. Do not create abstractions until at least two scenes need them.
14. Preserve accessibility.
15. Preserve SEO-friendly static content.

---

## Quality Bar

This project should feel like a polished interactive educational product, not a random demo.

The user should be able to open a concept page and immediately understand:

* what the concept means;
* why it matters;
* how it works;
* how it breaks;
* how it appears in real AI products.

The final experience should be strong enough to use as a portfolio project for AI product engineering and advanced frontend work.
