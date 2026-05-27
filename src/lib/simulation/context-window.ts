export type BlockType = "system" | "history" | "retrieved" | "tools" | "memory" | "query" | "noise";

export type ContextBlock = {
  id: string;
  type: BlockType;
  label: string;
  content: string;
  tokens: number;
  essential: boolean;
};

export const blockColors: Record<BlockType, string> = {
  system: "#f59e0b",
  history: "#3b82f6",
  retrieved: "#22c55e",
  tools: "#a78bfa",
  memory: "#ec4899",
  query: "#f0a500",
  noise: "#63636e",
};

export const systemPrompt: ContextBlock = {
  id: "system",
  type: "system",
  label: "System Prompt",
  content:
    "You are a helpful AI assistant. Answer questions using the provided context. If the context does not contain enough information, say so. Be concise and accurate.",
  tokens: 30,
  essential: true,
};

export const chatHistory: ContextBlock[] = [
  {
    id: "hist-1",
    type: "history",
    label: "History #1",
    content: "User: What's the weather like?\nAssistant: I don't have real-time weather access.",
    tokens: 15,
    essential: false,
  },
  {
    id: "hist-2",
    type: "history",
    label: "History #2",
    content:
      "User: Can you help me find vector database docs?\nAssistant: Sure, I'll search the knowledge base.",
    tokens: 20,
    essential: false,
  },
  {
    id: "hist-3",
    type: "history",
    label: "History #3",
    content:
      "User: How do I optimize PostgreSQL queries?\nAssistant: Use indexes, avoid SELECT *, use EXPLAIN ANALYZE, and consider partitioning for large tables.",
    tokens: 25,
    essential: false,
  },
  {
    id: "hist-4",
    type: "history",
    label: "History #4",
    content:
      "User: What about connection management?\nAssistant: Use a connection pool like pg-pool or pgBouncer. Set max connections based on your CPU cores.",
    tokens: 28,
    essential: false,
  },
  {
    id: "hist-5",
    type: "history",
    label: "History #5",
    content:
      "User: Any tips for Node.js specifically?\nAssistant: Use async/await with try/catch. Never use pg's client directly in production — always use a pool.",
    tokens: 32,
    essential: false,
  },
  {
    id: "hist-6",
    type: "history",
    label: "History #6",
    content:
      "User: How about monitoring?\nAssistant: Use pg_stat_statements extension. Track slow queries with EXPLAIN ANALYZE logs. Set up alerting for connection count.",
    tokens: 30,
    essential: false,
  },
  {
    id: "hist-7",
    type: "history",
    label: "History #7",
    content:
      "User: What indexing strategy for JSON columns?\nAssistant: Use GIN indexes with jsonb_path_ops for JSON querying. For specific fields, create expression indexes.",
    tokens: 28,
    essential: false,
  },
  {
    id: "hist-8",
    type: "history",
    label: "History #8",
    content:
      "User: Migration strategy for large tables?\nAssistant: Use pt-online-schema-change or pgroll for zero-downtime migrations. Never run ALTER TABLE directly on large production tables.",
    tokens: 32,
    essential: false,
  },
  {
    id: "hist-9",
    type: "history",
    label: "History #9",
    content:
      "User: Backup strategy?\nAssistant: Use pg_dump for logical backups and WAL archiving for PITR. Schedule daily full + hourly incremental with pgBackRest.",
    tokens: 30,
    essential: false,
  },
  {
    id: "hist-10",
    type: "history",
    label: "History #10",
    content:
      "User: Replication setup?\nAssistant: Use streaming replication with at least one synchronous standby. Consider logical replication for partial data sync between environments.",
    tokens: 28,
    essential: false,
  },
  {
    id: "hist-11",
    type: "history",
    label: "History #11",
    content:
      "User: What about sharding?\nAssistant: PostgreSQL supports partitioning natively. For horizontal scaling, consider Citus extension. Most apps don't need sharding before 500GB+.",
    tokens: 30,
    essential: false,
  },
  {
    id: "hist-12",
    type: "history",
    label: "History #12",
    content:
      "User: Any security best practices?\nAssistant: Use row-level security, TLS for connections, restrict network access with pg_hba.conf, and never expose the database to the public internet.",
    tokens: 32,
    essential: false,
  },
  {
    id: "hist-13",
    type: "history",
    label: "History #13",
    content:
      "User: Caching layer recommendations?\nAssistant: Use Redis for hot data. Implement cache-aside pattern. Consider PostgreSQL's LISTEN/NOTIFY for cache invalidation across instances.",
    tokens: 28,
    essential: false,
  },
  {
    id: "hist-14",
    type: "history",
    label: "History #14",
    content:
      "User: How about ORM vs raw SQL?\nAssistant: Use raw SQL for complex queries and migrations. ORMs are fine for simple CRUD. Drizzle and Knex give you type safety without the ORM overhead.",
    tokens: 30,
    essential: false,
  },
  {
    id: "hist-15",
    type: "history",
    label: "History #15",
    content:
      "User: Testing with databases?\nAssistant: Use transactional tests that roll back. Consider Testcontainers for integration tests. Mock at the repository layer for unit tests. Never test against production.",
    tokens: 30,
    essential: false,
  },
];

export const noiseBlocks: ContextBlock[] = [
  {
    id: "noise-1",
    type: "noise",
    label: "Noise #1",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    tokens: 20,
    essential: false,
  },
  {
    id: "noise-2",
    type: "noise",
    label: "Noise #2",
    content: "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump!",
    tokens: 22,
    essential: false,
  },
  {
    id: "noise-3",
    type: "noise",
    label: "Noise #3",
    content: "To be or not to be, that is the question. Whether tis nobler in the mind to suffer the slings and arrows of outrageous fortune.",
    tokens: 25,
    essential: false,
  },
  {
    id: "noise-4",
    type: "noise",
    label: "Noise #4",
    content: "All happy families are alike; each unhappy family is unhappy in its own way. Everything was in confusion in the Oblonskys house.",
    tokens: 24,
    essential: false,
  },
  {
    id: "noise-5",
    type: "noise",
    label: "Noise #5",
    content: "It was a bright cold day in April, and the clocks were striking thirteen. Winston Smith, his chin nuzzled into his breast, slipped quickly through the glass doors.",
    tokens: 28,
    essential: false,
  },
];

export const retrievedDocs: ContextBlock[] = [
  {
    id: "doc-1",
    type: "retrieved",
    label: "Retrieved: Pooling Guide",
    content:
      "Connection pooling is critical for PostgreSQL performance. Use pg-pool with Node.js and set max connections to 2-4x CPU cores. Monitor idle connections and set connection timeouts to prevent leaks. pgBouncer in transaction mode provides the best throughput for web applications.",
    tokens: 45,
    essential: false,
  },
  {
    id: "doc-2",
    type: "retrieved",
    label: "Retrieved: Node.js PG Best Practices",
    content:
      "Never create a new Client for each request. Always use a Pool. Handle connection errors with retry logic. Use parameterized queries to prevent SQL injection. Set statement_timeout to prevent long-running queries from blocking the pool. Consider using pg-native for 10-15% performance improvement.",
    tokens: 50,
    essential: false,
  },
  {
    id: "doc-3",
    type: "retrieved",
    label: "Retrieved: Connection Management",
    content:
      "For microservices, use a dedicated pool per service with conservative max connections. Implement circuit breakers for database calls. Use health checks to detect stale connections. Log slow queries and set up alerts for connection count nearing max. Consider read replicas for read-heavy workloads.",
    tokens: 48,
    essential: false,
  },
];

export const toolResult: ContextBlock = {
  id: "tools",
  type: "tools",
  label: "Tool Result",
  content:
    '{\n  "active_connections": 47,\n  "max_connections": 100,\n  "pool_utilization": "47%",\n  "avg_query_time_ms": 12.4,\n  "slow_queries_last_hour": 3,\n  "recommendation": "Increase max connections to 150 or add pgBouncer"\n}',
  tokens: 40,
  essential: false,
};

export const memoryBlock: ContextBlock = {
  id: "memory",
  type: "memory",
  label: "Memory",
  content:
    "User is a backend developer working with Node.js and PostgreSQL. Prefers TypeScript. Currently building a microservice architecture. Has production experience but is new to connection pooling optimization.",
  tokens: 30,
  essential: false,
};

export const userQuery: ContextBlock = {
  id: "query",
  type: "query",
  label: "Current Query",
  content: "What's the best way to handle connection pooling in PostgreSQL with Node.js?",
  tokens: 15,
  essential: true,
};

export function buildContext(
  contextSize: number,
  historyCount: number,
  noiseCount: number,
  enableSummarization: boolean,
) {
  const blocks: ContextBlock[] = [systemPrompt];

  const selectedHistory = chatHistory.slice(0, historyCount);
  if (enableSummarization) {
    blocks.push({
      id: "history-summary",
      type: "history",
      label: "History (summarized)",
      content: `[Previous ${selectedHistory.length} messages summarized]: User asked about PostgreSQL optimization, connection management, monitoring, indexing, migrations, backups, replication, security, caching, ORMs, and testing.`,
      tokens: 25,
      essential: false,
    });
  } else {
    blocks.push(...selectedHistory);
  }

  blocks.push(...retrievedDocs);
  blocks.push(toolResult);
  blocks.push(memoryBlock);

  for (let i = 0; i < noiseCount; i++) {
    if (i < noiseBlocks.length) {
      blocks.push(noiseBlocks[i]);
    }
  }

  blocks.push(userQuery);

  let tokensUsed = 0;
  const fittingBlocks: ContextBlock[] = [];
  const excludedBlocks: ContextBlock[] = [];

  for (const block of blocks) {
    if (tokensUsed + block.tokens <= contextSize) {
      fittingBlocks.push(block);
      tokensUsed += block.tokens;
    } else {
      excludedBlocks.push(block);
    }
  }

  const hasEssentialExcluded = excludedBlocks.some((b) => b.essential);

  return {
    fittingBlocks,
    excludedBlocks,
    tokensUsed,
    contextSize,
    hasEssentialExcluded,
    summarized: enableSummarization && historyCount > 0,
  };
}

export type ContextPreset = {
  id: string;
  title: string;
  description: string;
  settings: {
    contextSize: number;
    historyCount: number;
    noiseCount: number;
    enableSummarization: boolean;
  };
};

export const contextPresets: ContextPreset[] = [
  {
    id: "good-context",
    title: "Good context",
    description: "Balanced context — everything fits with room to spare.",
    settings: {
      contextSize: 4000,
      historyCount: 3,
      noiseCount: 0,
      enableSummarization: false,
    },
  },
  {
    id: "context-overflow",
    title: "Context overflow",
    description: "History + retrieved docs overflow context — user query and last docs get excluded.",
    settings: {
      contextSize: 2000,
      historyCount: 8,
      noiseCount: 2,
      enableSummarization: false,
    },
  },
  {
    id: "lost-instructions",
    title: "Lost instructions",
    description: "Too much history pushes out the system prompt — model loses its instructions.",
    settings: {
      contextSize: 2000,
      historyCount: 15,
      noiseCount: 0,
      enableSummarization: false,
    },
  },
  {
    id: "history-flood",
    title: "History flood",
    description: "Excessive history fills context — retrieved docs get excluded even with large window.",
    settings: {
      contextSize: 4000,
      historyCount: 15,
      noiseCount: 0,
      enableSummarization: false,
    },
  },
  {
    id: "summarization-helps",
    title: "Summarization helps",
    description: "With summarization enabled, history is compressed — everything fits even with limited context.",
    settings: {
      contextSize: 2000,
      historyCount: 8,
      noiseCount: 2,
      enableSummarization: true,
    },
  },
];
