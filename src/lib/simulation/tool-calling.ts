export type Tool = {
  id: string;
  name: string;
  description: string;
  badDescription: string;
  descriptionRu: string;
  badDescriptionRu: string;
  parameters: ToolParam[];
  isDestructive: boolean;
};

export type ToolParam = {
  name: string;
  type: string;
  description: string;
  required: boolean;
};

export type UserRequest = {
  id: string;
  label: string;
  labelRu: string;
  query: string;
  queryRu: string;
  expectedToolId: string;
  expectedArgs: Record<string, string>;
  context?: string;
};

export type ToolCallResult = {
  toolId: string;
  toolName: string;
  args: Record<string, string>;
  success: boolean;
  output: string;
  error?: string;
};

export const tools: Tool[] = [
  {
    id: "search_docs",
    name: "search_documents",
    description:
      "Search the internal knowledge base for documents matching a query string. Returns top results with relevance scores.",
    badDescription:
      "Searches stuff and finds things. Returns whatever it finds.",
    descriptionRu:
      "Поиск по внутренней базе знаний документов, соответствующих поисковому запросу. Возвращает топ результатов с оценками релевантности.",
    badDescriptionRu:
      "Ищет всякое и находит что-то. Возвращает что найдёт.",
    parameters: [
      {
        name: "query",
        type: "string",
        description: "The search query to find relevant documents",
        required: true,
      },
      {
        name: "max_results",
        type: "number",
        description: "Maximum number of results to return (default 5)",
        required: false,
      },
    ],
    isDestructive: false,
  },
  {
    id: "send_email",
    name: "send_email",
    description:
      "Send an email to one or more recipients. Supports subject, body, and CC fields. Requires explicit confirmation for external recipients.",
    badDescription:
      "Sends messages. Good for communication.",
    descriptionRu:
      "Отправка email одному или нескольким получателям. Поддерживает тему, тело письма и копии. Требует явного подтверждения для внешних получателей.",
    badDescriptionRu:
      "Отправляет сообщения. Подходит для коммуникации.",
    parameters: [
      {
        name: "to",
        type: "string",
        description: "Email address of the recipient",
        required: true,
      },
      {
        name: "subject",
        type: "string",
        description: "Subject line of the email",
        required: true,
      },
      {
        name: "body",
        type: "string",
        description: "Body content of the email",
        required: true,
      },
    ],
    isDestructive: true,
  },
  {
    id: "query_db",
    name: "query_database",
    description:
      "Run a read-only SQL query against the application database. Only SELECT queries are allowed. Results are returned as JSON.",
    badDescription:
      "Runs database commands and returns data.",
    descriptionRu:
      "Выполнение SQL-запроса только для чтения к базе данных приложения. Разрешены только SELECT-запросы. Результаты возвращаются в JSON.",
    badDescriptionRu:
      "Выполняет команды базы данных и возвращает данные.",
    parameters: [
      {
        name: "sql",
        type: "string",
        description: "SQL SELECT query to execute (read-only)",
        required: true,
      },
    ],
    isDestructive: false,
  },
  {
    id: "create_ticket",
    name: "create_ticket",
    description:
      "Create a support ticket in the issue tracking system. Requires a title, description, and priority level.",
    badDescription:
      "Makes a new ticket for tracking problems.",
    descriptionRu:
      "Создание тикета поддержки в системе отслеживания задач. Требует заголовок, описание и уровень приоритета.",
    badDescriptionRu:
      "Создаёт новый тикет для отслеживания проблем.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "Short title summarizing the issue",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "Detailed description of the problem",
        required: true,
      },
      {
        name: "priority",
        type: "string",
        description: "Priority level: low, medium, high, or critical",
        required: true,
      },
    ],
    isDestructive: false,
  },
  {
    id: "get_weather",
    name: "get_weather",
    description:
      "Get current weather conditions for a specified city. Returns temperature, humidity, wind speed, and conditions.",
    badDescription:
      "Gets weather information for places.",
    descriptionRu:
      "Получение текущих погодных условий для указанного города. Возвращает температуру, влажность, скорость ветра и условия.",
    badDescriptionRu:
      "Получает информацию о погоде для мест.",
    parameters: [
      {
        name: "city",
        type: "string",
        description: "City name to get weather for",
        required: true,
      },
      {
        name: "units",
        type: "string",
        description: "Temperature units: celsius or fahrenheit (default celsius)",
        required: false,
      },
    ],
    isDestructive: false,
  },
];

export const similarTool: Tool = {
  id: "search_files",
  name: "search_files",
  description:
    "Search the file system for documents matching a query. Similar to search_documents but searches local files instead of the knowledge base.",
  badDescription:
    "Searches for files matching a query.",
  descriptionRu:
    "Поиск в файловой системе документов, соответствующих запросу. Похож на search_documents, но ищет локальные файлы вместо базы знаний.",
  badDescriptionRu:
    "Ищет файлы, соответствующие запросу.",
  parameters: [
    {
      name: "query",
      type: "string",
      description: "The search query to find matching files",
      required: true,
    },
    {
      name: "path",
      type: "string",
      description: "Directory path to search in",
      required: false,
    },
  ],
  isDestructive: false,
};

export const userRequests: UserRequest[] = [
  {
    id: "weather",
    label: "Check the weather in San Francisco",
    labelRu: "Узнать погоду в Сан-Франциско",
    query: "What's the current weather in San Francisco? I need temperature in celsius.",
    queryRu: "Какая сейчас погода в Сан-Франциско? Нужна температура в градусах Цельсия.",
    expectedToolId: "get_weather",
    expectedArgs: { city: "San Francisco", units: "celsius" },
  },
  {
    id: "search",
    label: "Find docs about vector databases",
    labelRu: "Найти документацию по векторным базам данных",
    query: "Find documentation about vector databases and similarity search.",
    queryRu: "Найди документацию о векторных базах данных и поиске по сходству.",
    expectedToolId: "search_docs",
    expectedArgs: { query: "vector databases similarity search", max_results: "5" },
  },
  {
    id: "db-query",
    label: "How many active users?",
    labelRu: "Сколько активных пользователей?",
    query: "How many active users do we have in the last 30 days?",
    queryRu: "Сколько у нас активных пользователей за последние 30 дней?",
    expectedToolId: "query_db",
    expectedArgs: { sql: "SELECT COUNT(*) FROM users WHERE last_active > NOW() - INTERVAL '30 days'" },
  },
  {
    id: "send-email",
    label: "Send deployment update to team",
    labelRu: "Отправить обновление о деплое команде",
    query: "Send an email to team@company.com with subject 'Deployment Complete' and let them know the new version is live.",
    queryRu: "Отправь письмо на team@company.com с темой 'Deployment Complete' и сообщи, что новая версия развёрнута.",
    expectedToolId: "send_email",
    expectedArgs: { to: "team@company.com", subject: "Deployment Complete", body: "The new version has been deployed and is now live." },
  },
  {
    id: "create-ticket",
    label: "Create ticket for login bug",
    labelRu: "Создать тикет для бага входа",
    query: "Create a high priority ticket — users are reporting they can't log in after the latest update. The error says 'Invalid session token'.",
    queryRu: "Создай тикет с высоким приоритетом — пользователи сообщают, что не могут войти после последнего обновления. Ошибка: 'Invalid session token'.",
    expectedToolId: "create_ticket",
    expectedArgs: { title: "Users unable to log in — Invalid session token error", description: "After the latest update, users report getting 'Invalid session token' error when trying to log in.", priority: "high" },
  },
  {
    id: "ambiguous",
    label: "Check weather and send update",
    labelRu: "Узнать погоду и отправить обновление",
    query: "Can you check the weather in New York and send an update email to the office manager?",
    queryRu: "Можешь узнать погоду в Нью-Йорке и отправить обновление по email офис-менеджеру?",
    expectedToolId: "get_weather",
    expectedArgs: { city: "New York", units: "celsius" },
    context: "Ambiguous: user mentioned both weather check and email. The model must pick the most relevant tool.",
  },
];

export function selectTool(
  query: string,
  availableTools: Tool[],
): { tool: Tool; score: number } {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 3);

  const scored = availableTools.map((tool) => {
    const descLower = tool.description.toLowerCase();
    const nameLower = tool.name.toLowerCase();

    let score = 0;

    for (const word of queryWords) {
      if (descLower.includes(word)) score += 2;
      if (nameLower.includes(word)) score += 3;
    }

    // Specific keyword boost
    if (queryLower.includes("weather") && tool.id === "get_weather") score += 5;
    if (queryLower.includes("document") && tool.id === "search_docs") score += 5;
    if ((queryLower.includes("search") || queryLower.includes("find")) && tool.id === "search_docs") score += 4;
    if ((queryLower.includes("email") || queryLower.includes("send")) && tool.id === "send_email") score += 5;
    if ((queryLower.includes("user") || queryLower.includes("sql") || queryLower.includes("many")) && tool.id === "query_db") score += 5;
    if ((queryLower.includes("ticket") || queryLower.includes("bug") || queryLower.includes("issue")) && tool.id === "create_ticket") score += 5;

    // Normalize by description length to avoid bias
    score = score / Math.max(1, descLower.split(/\s+/).length / 10);

    return { tool, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

export function generateArgs(
  tool: Tool,
  query: string,
): Record<string, string> {
  const args: Record<string, string> = {};

  for (const param of tool.parameters) {
    if (!param.required) continue;

    // Simple extraction based on tool and query
    switch (tool.id) {
      case "get_weather":
        if (param.name === "city") {
          const cityMatch = query.match(/in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
          args.city = cityMatch ? cityMatch[1] : "Unknown";
        }
        if (param.name === "units") {
          args.units = query.toLowerCase().includes("fahrenheit") ? "fahrenheit" : "celsius";
        }
        break;

      case "search_docs":
        if (param.name === "query") {
          args.query = query.replace(/find\s+(docs?|documents?|information)\s+(?:about|on|for)\s+/i, "").trim();
        }
        if (param.name === "max_results") {
          args.max_results = "5";
        }
        break;

      case "query_db":
        if (param.name === "sql") {
          if (query.toLowerCase().includes("active users")) {
            args.sql = "SELECT COUNT(*) as active_users FROM users WHERE last_active > NOW() - INTERVAL '30 days'";
          } else {
            args.sql = `SELECT * FROM data WHERE query = '${query.slice(0, 50)}'`;
          }
        }
        break;

      case "send_email":
        if (param.name === "to") {
          const emailMatch = query.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          args.to = emailMatch ? emailMatch[1] : "user@example.com";
        }
        if (param.name === "subject") {
          const subjectMatch = query.match(/subject\s+['"](.+?)['"]/i);
          args.subject = subjectMatch ? subjectMatch[1] : "Update";
        }
        if (param.name === "body") {
          args.body = query.includes("deploy") ? "The new version has been deployed and is now live." : "Here is the information you requested.";
        }
        break;

      case "create_ticket":
        if (param.name === "title") {
          args.title = query.includes("login") ? "Users unable to log in — Invalid session token error" : "Issue reported by user";
        }
        if (param.name === "description") {
          args.description = query.includes("login") ? "After the latest update, users report getting 'Invalid session token' error when trying to log in." : "User reported an issue that needs investigation.";
        }
        if (param.name === "priority") {
          args.priority = query.toLowerCase().includes("high") || query.toLowerCase().includes("critical") ? "high" : "medium";
        }
        break;

      case "search_files":
        if (param.name === "query") {
          args.query = query.replace(/find\s+(files?|documents?)\s+(?:about|on|for|matching)\s+/i, "").trim();
        }
        if (param.name === "path") {
          args.path = "/documents";
        }
        break;
    }
  }

  return args;
}

export function executeTool(
  toolId: string,
  args: Record<string, string>,
  simulateError: boolean,
): ToolCallResult {
  if (simulateError) {
    return {
      toolId,
      toolName: tools.find((t) => t.id === toolId)?.name ?? toolId,
      args,
      success: false,
      output: "",
      error: getErrorMessage(toolId),
    };
  }

  const output = getToolOutput(toolId, args);

  return {
    toolId,
    toolName: tools.find((t) => t.id === toolId)?.name ?? toolId,
    args,
    success: true,
    output,
  };
}

function getErrorMessage(toolId: string): string {
  switch (toolId) {
    case "search_docs":
      return "Search index is currently rebuilding. Please try again in a few minutes.";
    case "send_email":
      return "SMTP server connection refused. The email service is temporarily unavailable.";
    case "query_db":
      return "Query timeout after 30 seconds. The database is experiencing high load. Simplify your query.";
    case "create_ticket":
      return "Ticket system API returned 503. The issue tracker is down for maintenance.";
    case "get_weather":
      return "Weather API rate limit exceeded. You have made too many requests. Please wait before retrying.";
    default:
      return "Tool execution failed due to an internal server error.";
  }
}

function getToolOutput(toolId: string, args: Record<string, string>): string {
  switch (toolId) {
    case "search_docs":
      return JSON.stringify({
        results: [
          { title: "Vector Database Guide", score: 0.94, snippet: "Vector databases store high-dimensional embeddings..." },
          { title: "Similarity Search Best Practices", score: 0.87, snippet: "Use cosine similarity for text embeddings..." },
          { title: "HNSW Index Configuration", score: 0.82, snippet: "HNSW provides logarithmic search complexity..." },
        ],
        total_found: 24,
      }, null, 2);

    case "send_email":
      return JSON.stringify({
        status: "sent",
        message_id: "msg_abc123xyz",
        recipients: [args.to || "unknown"],
        timestamp: new Date().toISOString(),
      }, null, 2);

    case "query_db":
      return JSON.stringify({
        rows: [{ active_users: 2847 }],
        query_time_ms: 42,
        rows_returned: 1,
      }, null, 2);

    case "create_ticket":
      return JSON.stringify({
        ticket_id: "TICKET-4829",
        status: "created",
        priority: args.priority || "medium",
        created_at: new Date().toISOString(),
        assignee: "unassigned",
      }, null, 2);

    case "get_weather":
      return JSON.stringify({
        city: args.city || "Unknown",
        temperature: 18,
        humidity: 72,
        wind_speed: 12,
        conditions: "Partly cloudy",
        units: args.units || "celsius",
      }, null, 2);

    default:
      return JSON.stringify({ status: "ok" });
  }
}

export type ToolCallingPreset = {
  id: string;
  title: string;
  description: string;
  settings: {
    userQuery: string;
    useBadDescriptions: boolean;
    requireApproval: boolean;
    simulateError: boolean;
    enableSimilarTools: boolean;
  };
};

export const toolCallingPresets: ToolCallingPreset[] = [
  {
    id: "good-tool-call",
    title: "Good tool call",
    description: "Clear descriptions, correct tool selected, successful execution.",
    settings: {
      userQuery: userRequests[0].query,
      useBadDescriptions: false,
      requireApproval: false,
      simulateError: false,
      enableSimilarTools: false,
    },
  },
  {
    id: "bad-description",
    title: "Bad description",
    description: "Vague tool descriptions cause wrong tool selection.",
    settings: {
      userQuery: userRequests[1].query,
      useBadDescriptions: true,
      requireApproval: false,
      simulateError: false,
      enableSimilarTools: false,
    },
  },
  {
    id: "similar-tools",
    title: "Similar tools",
    description: "Two similar tools (search_documents vs search_files) confuse the model.",
    settings: {
      userQuery: userRequests[1].query,
      useBadDescriptions: false,
      requireApproval: false,
      simulateError: false,
      enableSimilarTools: true,
    },
  },
  {
    id: "need-approval",
    title: "Needs approval",
    description: "Sending an email requires human approval before execution.",
    settings: {
      userQuery: userRequests[3].query,
      useBadDescriptions: false,
      requireApproval: true,
      simulateError: false,
      enableSimilarTools: false,
    },
  },
  {
    id: "tool-error",
    title: "Tool error",
    description: "The selected tool returns an error — model must handle it gracefully.",
    settings: {
      userQuery: userRequests[0].query,
      useBadDescriptions: false,
      requireApproval: false,
      simulateError: true,
      enableSimilarTools: false,
    },
  },
];
