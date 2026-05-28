export type MemorySnippet = {
  id: string;
  content: string;
  contentRu: string;
  category: "preferences" | "skills" | "context" | "history";
  timestamp: string;
  timestampRu: string;
  relevanceScore: number;
  isStale: boolean;
};

export type MemoryQuery = {
  id: string;
  label: string;
  labelRu: string;
  query: string;
  queryRu: string;
};

export type RetrievedMemory = {
  memory: MemorySnippet;
  queryScore: number;
  isAboveThreshold: boolean;
  reason: string;
  reasonRu: string;
};

export type MemoryPreset = {
  id: string;
  title: string;
  description: string;
  settings: {
    selectedQueryId: string;
    contextLimit: number;
    activeSnippetIds: string[];
  };
};

export const allMemories: MemorySnippet[] = [
  {
    id: "mem-1",
    content: "Anna prefers TypeScript over JavaScript",
    contentRu: "Анна предпочитает TypeScript, а не JavaScript",
    category: "preferences",
    timestamp: "2 days ago",
    timestampRu: "2 дня назад",
    relevanceScore: 0.9,
    isStale: false,
  },
  {
    id: "mem-2",
    content: "Anna works as a senior fullstack developer at TechCorp",
    contentRu: "Анна работает старшим fullstack-разработчиком в TechCorp",
    category: "context",
    timestamp: "30 days ago",
    timestampRu: "30 дней назад",
    relevanceScore: 0.8,
    isStale: false,
  },
  {
    id: "mem-3",
    content: "Anna is building a microservice architecture with Node.js and PostgreSQL",
    contentRu: "Анна строит микросервисную архитектуру на Node.js и PostgreSQL",
    category: "context",
    timestamp: "14 days ago",
    timestampRu: "14 дней назад",
    relevanceScore: 0.85,
    isStale: false,
  },
  {
    id: "mem-4",
    content: "Anna used to work with Python and Django before switching to Node.js",
    contentRu: "Анна раньше работала с Python и Django, прежде чем перейти на Node.js",
    category: "skills",
    timestamp: "180 days ago",
    timestampRu: "180 дней назад",
    relevanceScore: 0.5,
    isStale: true,
  },
  {
    id: "mem-5",
    content: "Anna lives in Berlin and works remotely",
    contentRu: "Анна живёт в Берлине и работает удалённо",
    category: "context",
    timestamp: "60 days ago",
    timestampRu: "60 дней назад",
    relevanceScore: 0.3,
    isStale: false,
  },
  {
    id: "mem-6",
    content: "Anna's current project involves real-time data processing",
    contentRu: "Текущий проект Анны связан с обработкой данных в реальном времени",
    category: "context",
    timestamp: "7 days ago",
    timestampRu: "7 дней назад",
    relevanceScore: 0.9,
    isStale: false,
  },
  {
    id: "mem-7",
    content: "Anna previously used pnpm but switched to npm for compatibility",
    contentRu: "Анна раньше использовала pnpm, но перешла на npm для совместимости",
    category: "preferences",
    timestamp: "90 days ago",
    timestampRu: "90 дней назад",
    relevanceScore: 0.3,
    isStale: true,
  },
  {
    id: "mem-8",
    content: "Anna needs to deploy to AWS ECS with Docker",
    contentRu: "Анне нужно деплоить в AWS ECS с Docker",
    category: "context",
    timestamp: "1 day ago",
    timestampRu: "1 день назад",
    relevanceScore: 0.95,
    isStale: false,
  },
];

export const allQueries: MemoryQuery[] = [
  {
    id: "q-stack",
    label: "What tech stack does Anna use?",
    labelRu: "Какой техстек использует Анна?",
    query: "What tech stack does Anna use?",
    queryRu: "Какой техстек использует Анна?",
  },
  {
    id: "q-work",
    label: "Where does Anna work and live?",
    labelRu: "Где Анна работает и живёт?",
    query: "Where does Anna work and live?",
    queryRu: "Где Анна работает и живёт?",
  },
  {
    id: "q-project",
    label: "What is Anna's current project?",
    labelRu: "Над каким проектом Анна работает сейчас?",
    query: "What is Anna's current project?",
    queryRu: "Над каким проектом Анна работает сейчас?",
  },
  {
    id: "q-deploy",
    label: "How should Anna deploy?",
    labelRu: "Как Анне выполнить деплой?",
    query: "How should Anna deploy?",
    queryRu: "Как Анне выполнить деплой?",
  },
  {
    id: "q-pm",
    label: "What package manager does Anna prefer?",
    labelRu: "Какой пакетный менеджер предпочитает Анна?",
    query: "What package manager does Anna prefer?",
    queryRu: "Какой пакетный менеджер предпочитает Анна?",
  },
];

const queryScoreMap: Record<string, Record<string, { score: number; reason: string; reasonRu: string }>> = {
  "q-stack": {
    "mem-1": { score: 0.95, reason: "Direct match — TypeScript preference", reasonRu: "Прямое совпадение — предпочтение TypeScript" },
    "mem-3": { score: 0.9, reason: "Strong match — describes current stack", reasonRu: "Сильное совпадение — описывает текущий стек" },
    "mem-4": { score: 0.65, reason: "Moderate match — historical stack info", reasonRu: "Умеренное совпадение — историческая информация о стеке" },
    "mem-7": { score: 0.7, reason: "Good match — package manager info", reasonRu: "Хорошее совпадение — информация о пакетном менеджере" },
    "mem-6": { score: 0.4, reason: "Weak match — project detail, not stack", reasonRu: "Слабое совпадение — деталь проекта, не стек" },
    "mem-8": { score: 0.35, reason: "Weak match — deployment, not stack", reasonRu: "Слабое совпадение — деплой, не стек" },
    "mem-2": { score: 0.2, reason: "Low match — about workplace, not stack", reasonRu: "Низкое совпадение — о месте работы, не о стеке" },
    "mem-5": { score: 0.1, reason: "Very low match — about location", reasonRu: "Очень низкое совпадение — о местоположении" },
  },
  "q-work": {
    "mem-2": { score: 0.95, reason: "Direct match — employer and role", reasonRu: "Прямое совпадение — работодатель и должность" },
    "mem-5": { score: 0.85, reason: "Strong match — location and remote status", reasonRu: "Сильное совпадение — местоположение и удалёнка" },
    "mem-3": { score: 0.3, reason: "Low match — about project, not workplace", reasonRu: "Низкое совпадение — о проекте, не о месте работы" },
    "mem-8": { score: 0.2, reason: "Low match — about deployment", reasonRu: "Низкое совпадение — о деплое" },
    "mem-1": { score: 0.1, reason: "Very low — about preferences", reasonRu: "Очень низкое — о предпочтениях" },
    "mem-6": { score: 0.15, reason: "Very low — about current project", reasonRu: "Очень низкое — о текущем проекте" },
    "mem-4": { score: 0.1, reason: "Very low — about historical skills", reasonRu: "Очень низкое — об исторических навыках" },
    "mem-7": { score: 0.05, reason: "Very low — about package manager", reasonRu: "Очень низкое — о пакетном менеджере" },
  },
  "q-project": {
    "mem-6": { score: 0.95, reason: "Direct match — describes current project", reasonRu: "Прямое совпадение — описывает текущий проект" },
    "mem-3": { score: 0.85, reason: "Strong match — project architecture", reasonRu: "Сильное совпадение — архитектура проекта" },
    "mem-8": { score: 0.75, reason: "Good match — deployment needs for project", reasonRu: "Хорошее совпадение — потребности деплоя для проекта" },
    "mem-1": { score: 0.35, reason: "Weak match — tech preference context", reasonRu: "Слабое совпадение — контекст предпочтений" },
    "mem-2": { score: 0.2, reason: "Low match — about employer", reasonRu: "Низкое совпадение — о работодателе" },
    "mem-4": { score: 0.15, reason: "Very low — historical skills", reasonRu: "Очень низкое — исторические навыки" },
    "mem-5": { score: 0.1, reason: "Very low — about location", reasonRu: "Очень низкое — о местоположении" },
    "mem-7": { score: 0.25, reason: "Low match — package manager detail", reasonRu: "Низкое совпадение — деталь о пакетном менеджере" },
  },
  "q-deploy": {
    "mem-8": { score: 0.95, reason: "Direct match — deployment requirements", reasonRu: "Прямое совпадение — требования деплоя" },
    "mem-3": { score: 0.6, reason: "Moderate match — architecture affects deployment", reasonRu: "Умеренное совпадение — архитектура влияет на деплой" },
    "mem-6": { score: 0.45, reason: "Partial match — project context", reasonRu: "Частичное совпадение — контекст проекта" },
    "mem-1": { score: 0.15, reason: "Low match — about preferences", reasonRu: "Низкое совпадение — о предпочтениях" },
    "mem-7": { score: 0.1, reason: "Very low — about package manager", reasonRu: "Очень низкое — о пакетном менеджере" },
    "mem-2": { score: 0.15, reason: "Very low — about employer", reasonRu: "Очень низкое — о работодателе" },
    "mem-4": { score: 0.1, reason: "Very low — historical skills", reasonRu: "Очень низкое — исторические навыки" },
    "mem-5": { score: 0.1, reason: "Very low — about location", reasonRu: "Очень низкое — о местоположении" },
  },
  "q-pm": {
    "mem-7": { score: 0.85, reason: "Direct match — package manager change", reasonRu: "Прямое совпадение — смена пакетного менеджера" },
    "mem-1": { score: 0.7, reason: "Good match — related tech preference", reasonRu: "Хорошее совпадение — связанное предпочтение" },
    "mem-3": { score: 0.3, reason: "Low match — about architecture", reasonRu: "Низкое совпадение — об архитектуре" },
    "mem-4": { score: 0.15, reason: "Very low — historical skills", reasonRu: "Очень низкое — исторические навыки" },
    "mem-8": { score: 0.1, reason: "Very low — about deployment", reasonRu: "Очень низкое — о деплое" },
    "mem-2": { score: 0.05, reason: "Very low — about employer", reasonRu: "Очень низкое — о работодателе" },
    "mem-5": { score: 0.05, reason: "Very low — about location", reasonRu: "Очень низкое — о местоположении" },
    "mem-6": { score: 0.2, reason: "Low match — project detail", reasonRu: "Низкое совпадение — деталь проекта" },
  },
};

const RETRIEVAL_THRESHOLD = 0.5;

export function retrieveMemories(
  memories: MemorySnippet[],
  activeIds: Set<string>,
  queryId: string,
): RetrievedMemory[] {
  const scoreMap = queryScoreMap[queryId] ?? {};
  const results: RetrievedMemory[] = [];

  for (const memory of memories) {
    const isActive = activeIds.has(memory.id);
    const qs = scoreMap[memory.id] ?? {
      score: memory.relevanceScore * 0.2,
      reason: "No semantic match with query",
      reasonRu: "Нет семантического совпадения с запросом",
    };

    const effectiveScore = isActive ? qs.score : 0;

    results.push({
      memory,
      queryScore: effectiveScore,
      isAboveThreshold: effectiveScore >= RETRIEVAL_THRESHOLD,
      reason: qs.reason,
      reasonRu: qs.reasonRu,
    });
  }

  results.sort((a, b) => b.queryScore - a.queryScore);
  return results;
}

export function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.split(/\s+/).length * 1.3));
}

export function buildContext(
  retrieved: RetrievedMemory[],
  contextLimit: number,
): {
  fitting: RetrievedMemory[];
  excluded: RetrievedMemory[];
  tokensUsed: number;
  hasEssentialExcluded: boolean;
} {
  const fitting: RetrievedMemory[] = [];
  const excluded: RetrievedMemory[] = [];
  let tokensUsed = 0;

  // Only consider active, above-threshold memories
  const candidates = retrieved.filter((r) => r.isAboveThreshold);

  for (const r of candidates) {
    const tokens = estimateTokens(r.memory.content);
    if (tokensUsed + tokens <= contextLimit) {
      fitting.push(r);
      tokensUsed += tokens;
    } else {
      excluded.push(r);
    }
  }

  const hasEssentialExcluded = excluded.length > 0 && fitting.length > 0;

  return { fitting, excluded, tokensUsed, hasEssentialExcluded };
}

export const memoryPresets: MemoryPreset[] = [
  {
    id: "normal-memory",
    title: "Normal memory",
    description: "All memories active, relevant ones retrieved, everything fits.",
    settings: {
      selectedQueryId: "q-stack",
      contextLimit: 400,
      activeSnippetIds: allMemories.map((m) => m.id),
    },
  },
  {
    id: "stale-memory",
    title: "Stale memory",
    description: "Outdated memories (Python/Django, pnpm) are retrieved but are no longer correct.",
    settings: {
      selectedQueryId: "q-pm",
      contextLimit: 400,
      activeSnippetIds: allMemories.map((m) => m.id),
    },
  },
  {
    id: "overflow-memory",
    title: "Context overflow",
    description: "Context limit is too small — only a few memories fit, others are excluded.",
    settings: {
      selectedQueryId: "q-stack",
      contextLimit: 30,
      activeSnippetIds: allMemories.map((m) => m.id),
    },
  },
  {
    id: "deleted-memory",
    title: "Deleted memory",
    description: "Key memories have been deleted — the system cannot retrieve what is no longer stored.",
    settings: {
      selectedQueryId: "q-stack",
      contextLimit: 400,
      activeSnippetIds: ["mem-2", "mem-3", "mem-5", "mem-6", "mem-8", "mem-4", "mem-7"],
    },
  },
];

export const categoryColors: Record<string, string> = {
  preferences: "#a78bfa",
  skills: "#3b82f6",
  context: "#22c55e",
  history: "#f59e0b",
};

export const categoryLabels: Record<string, string> = {
  preferences: "Preferences",
  skills: "Skills",
  context: "Context",
  history: "History",
};
