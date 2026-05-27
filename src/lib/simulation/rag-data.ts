import type { FailureMode } from "@/types/scenes";

export type MockDocument = {
  id: string;
  title: string;
  content: string;
};

export const mockDocuments: MockDocument[] = [
  {
    id: "doc-vec-db",
    title: "Vector Database Architecture Guide",
    content:
      "Vector databases store high-dimensional embeddings and enable efficient similarity search. The most common index types include HNSW (Hierarchical Navigable Small World) and IVF (Inverted File Index). HNSW builds a multi-layer graph where each layer skips more nodes, providing logarithmic search complexity. IVF partitions the vector space into clusters and searches only the nearest clusters. For production deployments, consider using HNSW for low-latency applications and IVF for memory-constrained environments. Similarity metrics matter: cosine similarity works well for text embeddings, while Euclidean distance suits image embeddings. Quantization techniques like product quantization can reduce memory usage by 4-8x with minimal accuracy loss. Always benchmark your index against your specific data distribution before deploying.",
  },
  {
    id: "doc-embedding",
    title: "Embedding Model Selection Guide",
    content:
      "Choosing the right embedding model depends on your domain and task. General-purpose models like text-embedding-3-small work well for most use cases, while domain-specific models outperform on specialized content. Key factors include embedding dimension (256 to 3072), supported languages, and maximum token length. Higher dimensions capture more semantic nuance but increase storage and search costs. The MTEB benchmark provides standardized evaluation across clustering, classification, and retrieval tasks. For multilingual applications, models supporting 100+ languages are available. Consider fine-tuning on your domain data for significant quality improvements, especially for technical or medical content. Embedding quality directly impacts retrieval quality in RAG systems.",
  },
  {
    id: "doc-rag",
    title: "RAG Implementation Best Practices",
    content:
      "Retrieval-Augmented Generation combines search with generation to ground LLM outputs in external documents. The pipeline consists of document ingestion, chunking, embedding, indexing, retrieval, and context assembly. Chunk size is critical: too small loses context, too large dilutes relevance. A good starting point is 300-500 tokens per chunk with 10-20% overlap. Semantic chunking based on paragraph or section boundaries often outperforms fixed-size splitting. The retrieval stage uses vector similarity search to find relevant chunks, typically returning top 3-10 results. Reranking with a cross-encoder model can significantly improve retrieval precision by rescoring initial candidates. The final context must fit within the model's context window alongside the system prompt and conversation history.",
  },
  {
    id: "doc-context",
    title: "Context Window Optimization Strategies",
    content:
      "The context window limits how much information a model can process in a single request. Modern models support 8K to 200K+ tokens, but longer contexts increase latency, cost, and the risk of attention dilution where the model fails to focus on relevant information. Effective strategies include: prioritizing recent conversation turns, summarizing older history, truncating low-relevance retrieved chunks, and using a sliding window approach for long documents. Token counting matters: always estimate the system prompt, user message, retrieved chunks, and tool results before sending. If important instructions get pushed out of context, the model may ignore constraints. Context overflow is a common failure mode in RAG systems when too many chunks are retrieved.",
  },
  {
    id: "doc-tool-calling",
    title: "Tool Calling Specification",
    content:
      "Tool calling (function calling) lets the model request execution of predefined functions by generating structured JSON arguments. Each tool definition includes a name, description, and JSON Schema for parameters. The model selects a tool based on the user's request and the tool descriptions, so descriptions must be clear and specific. Vague descriptions cause wrong tool selection, while overly similar tools confuse the model. The application, not the model, executes the tool and returns the result. Always validate tool arguments before execution, especially for destructive operations. Consider human approval for sensitive actions like sending emails or modifying data. Tool errors should be returned to the model with clear error messages so it can retry or ask for clarification.",
  },
];

export type QueryOption = {
  id: string;
  label: string;
  query: string;
  expectedDocIds: string[];
};

export const queryOptions: QueryOption[] = [
  {
    id: "chunk-size",
    label: "How to choose chunk size?",
    query: "How do I choose the right chunk size for my documents?",
    expectedDocIds: ["doc-rag", "doc-vec-db"],
  },
  {
    id: "rag-best-practices",
    label: "RAG best practices",
    query: "What are the best practices for implementing RAG?",
    expectedDocIds: ["doc-rag", "doc-embedding", "doc-context"],
  },
  {
    id: "vector-search",
    label: "How vector search works",
    query: "How does vector similarity search work in production?",
    expectedDocIds: ["doc-vec-db", "doc-embedding"],
  },
  {
    id: "context-limit",
    label: "Context window limits",
    query: "What happens when the context window overflows?",
    expectedDocIds: ["doc-context", "doc-rag"],
  },
  {
    id: "tool-definition",
    label: "Define tool calling",
    query: "How should I define tools and their parameters?",
    expectedDocIds: ["doc-tool-calling"],
  },
  {
    id: "embedding-choice",
    label: "Choose embedding model",
    query: "Which embedding model should I use for my application?",
    expectedDocIds: ["doc-embedding", "doc-vec-db"],
  },
];

export type RagPreset = {
  id: string;
  title: string;
  description: string;
  settings: {
    chunkSize: number;
    topK: number;
    contextLimit: number;
    noiseLevel: number;
    userQuery: string;
  };
};

export const ragPresets: RagPreset[] = [
  {
    id: "good-rag",
    title: "Good RAG",
    description: "Optimal settings: balanced chunks, sufficient retrieval, clean results.",
    settings: {
      chunkSize: 400,
      topK: 4,
      contextLimit: 2000,
      noiseLevel: 0,
      userQuery: "Как правильно выбрать размер чанка для моих документов?",
    },
  },
  {
    id: "bad-chunking",
    title: "Bad chunking",
    description: "Chunks are too small — fragments lose context and meaning.",
    settings: {
      chunkSize: 100,
      topK: 4,
      contextLimit: 2000,
      noiseLevel: 0,
      userQuery: "Как правильно выбрать размер чанка для моих документов?",
    },
  },
  {
    id: "topk-low",
    title: "TopK too low",
    description: "Only one chunk retrieved — misses relevant content from other documents.",
    settings: {
      chunkSize: 400,
      topK: 1,
      contextLimit: 2000,
      noiseLevel: 0,
      userQuery: "Каковы лучшие практики внедрения RAG?",
    },
  },
  {
    id: "too-much-noise",
    title: "Too much noise",
    description: "Noise documents pollute retrieval with irrelevant chunks.",
    settings: {
      chunkSize: 400,
      topK: 4,
      contextLimit: 2000,
      noiseLevel: 0.5,
      userQuery: "Как правильно выбрать размер чанка для моих документов?",
    },
  },
  {
    id: "context-overflow",
    title: "Context overflow",
    description: "Context limit too small — relevant chunks get excluded.",
    settings: {
      chunkSize: 400,
      topK: 4,
      contextLimit: 400,
      noiseLevel: 0,
      userQuery: "Как правильно выбрать размер чанка для моих документов?",
    },
  },
];

export const ragFailureModes: FailureMode[] = [
  {
    id: "chunk-too-large",
    title: "Chunk too large",
    description: "Large chunks include irrelevant content, diluting the relevant signal in the context.",
    explanation: "When chunks are too large, the model must process irrelevant text alongside useful information, reducing answer quality.",
  },
  {
    id: "chunk-too-small",
    title: "Chunk too small",
    description: "Small chunks lose surrounding context. A single sentence rarely contains the full answer.",
    explanation: "The model sees isolated fragments without the context needed to understand them properly.",
  },
  {
    id: "topk-too-low",
    title: "TopK too low",
    description: "Retrieving too few chunks misses relevant information from other documents.",
    explanation: "When TopK is 1, any single chunk may not contain the complete answer, even if it's highly relevant.",
  },
  {
    id: "topk-too-high",
    title: "TopK too high",
    description: "Too many chunks fill the context with marginally relevant content, pushing out more important information.",
    explanation: "The model wastes context space on chunks with low relevance, reducing room for the system prompt and conversation history.",
  },
  {
    id: "noisy-retrieval",
    title: "Noisy retrieval",
    description: "Irrelevant chunks pollute the context. The model may use wrong information to answer.",
    explanation: "Noise documents are chunks that score well by coincidence but contain unrelated content. They mislead the model.",
  },
  {
    id: "context-overflow",
    title: "Context overflow",
    description: "When the context limit is reached, additional chunks are excluded — even relevant ones.",
    explanation: "Important instructions or retrieved chunks may be dropped, causing the model to ignore constraints or miss key information.",
  },
];

import type { ScoredChunk } from "./retrieval";

export function generateAnswer(
  query: string,
  fittingChunks: ScoredChunk[],
  excludedChunks: ScoredChunk[],
): string {
  if (fittingChunks.length === 0) {
    return "I don't have enough context to answer this question. No relevant documents were retrieved or they were excluded due to context overflow.";
  }

  const relevantCount = fittingChunks.filter((c) => c.isRelevant).length;
  const avgScore =
    fittingChunks.reduce((sum, c) => sum + c.score, 0) / fittingChunks.length;
  const hasNoise = fittingChunks.some((c) => !c.isRelevant && c.score > 0.3);
  const hasOverflow = excludedChunks.length > 0;

  if (relevantCount === 0 || avgScore < 0.2) {
    return "I couldn't find relevant information to answer this question. The retrieved documents don't appear to contain the information you're looking for. Try a different query or check if your documents cover this topic.";
  }

  if (hasNoise && relevantCount <= 1) {
    return "Based on the available context, I can provide a partial answer. However, some retrieved documents appear unrelated to your question. The relevant information suggests general approaches, but I recommend retrieving cleaner results for a complete answer.";
  }

  if (hasOverflow && relevantCount < 2) {
    return "The context window overflowed and some potentially relevant chunks were excluded. Based on what's available: chunk size selection depends on your use case. Smaller chunks provide precision but risk losing context. Larger chunks retain context but may dilute relevance. Without the excluded chunks, this answer may be incomplete.";
  }

  switch (true) {
    case query.includes("chunk size"):
      return "Choosing the right chunk size requires balancing precision and context. A good starting point is 300-500 tokens per chunk with 10-20% overlap. Too small chunks lose surrounding context and may fragment key information. Too large chunks dilute relevance by mixing unrelated content. Semantic chunking by paragraph or section boundaries often works better than fixed-size splitting. For technical documentation, larger chunks (400-600 tokens) preserve code examples and their explanations together. For FAQ-style content, smaller chunks (200-300 tokens) work well since each answer is self-contained.";

    case query.includes("RAG"):
      return "For effective RAG implementation, start with semantic chunking at 300-500 tokens per chunk. Store embeddings in a vector database using cosine similarity for text. Retrieve top 3-10 relevant chunks using vector search. Consider adding a cross-encoder reranking step to improve precision — it typically boosts relevance by 15-30%. Always monitor context usage: the retrieved chunks compete with system prompts and conversation history for context space. Most importantly, evaluate retrieval quality with your actual queries and documents, not just benchmarks.";

    case query.includes("vector"):
      return "Vector similarity search in production uses approximate nearest neighbor algorithms like HNSW or IVF. HNSW provides fast logarithmic search by building a multi-layer graph — each layer skips more nodes for efficient traversal. IVF partitions the vector space into clusters and searches only nearby clusters, trading some accuracy for lower memory. For text embeddings, use cosine similarity as the distance metric. Quantization techniques can reduce memory usage 4-8x with minimal accuracy loss. Always benchmark on your specific data distribution.";

    case query.includes("context window") || query.includes("overflow"):
      return "When the context window overflows, content is truncated from the beginning — older messages, instructions, or early retrieved chunks get dropped. This is dangerous because the system prompt (which contains critical instructions) is typically placed first and may be pushed out. Key strategies: prioritize recent conversation turns, summarize older history into compressed form, use a sliding window for long documents, and estimate all token usage before sending. If the model suddenly ignores constraints, context overflow is often the cause.";

    case query.includes("tool") || query.includes("define"):
      return "For effective tool calling, write clear and specific tool descriptions. Each tool needs a name, a description that explains when to use it, and a JSON Schema for parameters with types, descriptions, and required fields. Vague descriptions cause wrong tool selection. Tools with similar descriptions confuse the model — differentiate them clearly. The application executes the tool, not the model. Always validate arguments before execution and consider human approval for destructive operations. Return clear error messages to the model so it can retry with corrected arguments.";

    case query.includes("embedding"):
      return "Selecting an embedding model depends on your domain, language requirements, and performance needs. General-purpose models work well for most applications. Domain-specific models outperform on specialized content like medical or legal text. Key considerations: embedding dimension (256 to 3072), supported languages, and max token length. Higher dimensions capture more nuance but increase storage costs. The MTEB benchmark provides standardized comparisons. For RAG, embedding quality directly impacts retrieval quality — poor embeddings lead to poor retrieval regardless of the search algorithm.";

    default:
      return "Based on the retrieved context, I can provide relevant information about your question. The key factors to consider are: the quality of your data, the appropriateness of your retrieval settings, and the constraints of the context window. For optimal results, ensure your chunking strategy preserves context, your retrieval settings return sufficiently many relevant results, and your context window has enough space for both your instructions and the retrieved content.";
  }
}
