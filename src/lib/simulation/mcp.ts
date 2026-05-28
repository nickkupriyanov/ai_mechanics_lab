export type MCPServer = {
  id: string;
  name: string;
  description: string;
  descriptionRu: string;
  color: string;
  icon: string;
  tools: MCPTool[];
};

export type MCPTool = {
  name: string;
  description: string;
  descriptionRu: string;
  params: { name: string; type: string; description: string; descriptionRu: string; required: boolean }[];
};

export type QueryExample = {
  id: string;
  label: string;
  labelRu: string;
  query: string;
  queryRu: string;
  serverId: string;
};

export const mcpServers: MCPServer[] = [
  {
    id: "github",
    name: "GitHub",
    description: "Access repositories, issues, PRs, and code search through the GitHub MCP server.",
    descriptionRu: "Доступ к репозиториям, issues, PR и поиску кода через MCP-сервер GitHub.",
    color: "#333",
    icon: "🐙",
    tools: [
      {
        name: "search_repos",
        description: "Search GitHub repositories by keyword, language, stars, and topic. Returns ranked results with repo metadata.",
        descriptionRu: "Поиск репозиториев GitHub по ключевому слову, языку, звёздам и теме. Возвращает ранжированные результаты с метаданными.",
        params: [
          { name: "query", type: "string", description: "Search query for repositories", descriptionRu: "Поисковый запрос для репозиториев", required: true },
          { name: "language", type: "string", description: "Filter by programming language", descriptionRu: "Фильтр по языку программирования", required: false },
        ],
      },
      {
        name: "create_issue",
        description: "Create a new issue in a specified GitHub repository. Requires repo name, title, and description.",
        descriptionRu: "Создание нового issue в указанном репозитории GitHub. Требует имя репо, заголовок и описание.",
        params: [
          { name: "repo", type: "string", description: "Repository name (owner/repo)", descriptionRu: "Имя репозитория (владелец/репо)", required: true },
          { name: "title", type: "string", description: "Issue title", descriptionRu: "Заголовок issue", required: true },
          { name: "body", type: "string", description: "Issue description", descriptionRu: "Описание issue", required: true },
        ],
      },
      {
        name: "list_prs",
        description: "List open pull requests in a repository with status, author, and labels.",
        descriptionRu: "Список открытых pull requests в репозитории со статусом, автором и метками.",
        params: [
          { name: "repo", type: "string", description: "Repository name (owner/repo)", descriptionRu: "Имя репозитория (владелец/репо)", required: true },
          { name: "state", type: "string", description: "PR state: open, closed, or all", descriptionRu: "Состояние PR: open, closed или all", required: false },
        ],
      },
      {
        name: "get_file",
        description: "Get the content of a file from a repository at a specific path and branch.",
        descriptionRu: "Получение содержимого файла из репозитория по указанному пути и ветке.",
        params: [
          { name: "repo", type: "string", description: "Repository name (owner/repo)", descriptionRu: "Имя репозитория (владелец/репо)", required: true },
          { name: "path", type: "string", description: "File path in the repository", descriptionRu: "Путь к файлу в репозитории", required: true },
          { name: "ref", type: "string", description: "Branch or commit SHA (default: main)", descriptionRu: "Ветка или SHA коммита (по умолчанию main)", required: false },
        ],
      },
    ],
  },
  {
    id: "filesystem",
    name: "Filesystem",
    description: "Read, write, and search files on the local filesystem through the MCP server.",
    descriptionRu: "Чтение, запись и поиск файлов на локальной файловой системе через MCP-сервер.",
    color: "#f59e0b",
    icon: "📁",
    tools: [
      {
        name: "read_file",
        description: "Read the contents of a file at the given path. Returns the file content as a string.",
        descriptionRu: "Чтение содержимого файла по указанному пути. Возвращает содержимое файла как строку.",
        params: [
          { name: "path", type: "string", description: "Absolute path to the file", descriptionRu: "Абсолютный путь к файлу", required: true },
        ],
      },
      {
        name: "write_file",
        description: "Write content to a file at the given path. Creates the file if it doesn't exist.",
        descriptionRu: "Запись содержимого в файл по указанному пути. Создаёт файл, если он не существует.",
        params: [
          { name: "path", type: "string", description: "Absolute path to the file", descriptionRu: "Абсолютный путь к файлу", required: true },
          { name: "content", type: "string", description: "Content to write to the file", descriptionRu: "Содержимое для записи в файл", required: true },
        ],
      },
      {
        name: "list_directory",
        description: "List files and directories at the given path. Returns names, types, sizes, and permissions.",
        descriptionRu: "Список файлов и директорий по указанному пути. Возвращает имена, типы, размеры и права доступа.",
        params: [
          { name: "path", type: "string", description: "Absolute path to the directory", descriptionRu: "Абсолютный путь к директории", required: true },
        ],
      },
      {
        name: "search_files",
        description: "Recursively search for files matching a pattern in a directory.",
        descriptionRu: "Рекурсивный поиск файлов по шаблону в директории.",
        params: [
          { name: "path", type: "string", description: "Root directory to search in", descriptionRu: "Корневая директория для поиска", required: true },
          { name: "pattern", type: "string", description: "Glob pattern to match (e.g. *.ts)", descriptionRu: "Glob-шаблон для поиска (напр. *.ts)", required: true },
        ],
      },
    ],
  },
  {
    id: "database",
    name: "Database",
    description: "Query databases, explore schemas, and manage records through the database MCP server.",
    descriptionRu: "Запросы к базам данных, исследование схем и управление записями через MCP-сервер баз данных.",
    color: "#3b82f6",
    icon: "🗄️",
    tools: [
      {
        name: "query",
        description: "Execute a read-only SQL query against the connected database. Returns results as JSON.",
        descriptionRu: "Выполнение SQL-запроса только для чтения к подключённой базе данных. Возвращает результаты в JSON.",
        params: [
          { name: "sql", type: "string", description: "SQL query to execute (SELECT only)", descriptionRu: "SQL-запрос для выполнения (только SELECT)", required: true },
        ],
      },
      {
        name: "list_tables",
        description: "List all tables in the database with row counts and schema information.",
        descriptionRu: "Список всех таблиц в базе данных с количеством строк и информацией о схеме.",
        params: [
          { name: "schema", type: "string", description: "Schema name (default: public)", descriptionRu: "Имя схемы (по умолчанию: public)", required: false },
        ],
      },
      {
        name: "describe_table",
        description: "Show the column definitions, types, constraints, and indexes for a specific table.",
        descriptionRu: "Показать определения колонок, типы, ограничения и индексы для указанной таблицы.",
        params: [
          { name: "table", type: "string", description: "Table name to describe", descriptionRu: "Имя таблицы для описания", required: true },
        ],
      },
      {
        name: "create_record",
        description: "Insert a new record into a table. Returns the newly created record with its ID.",
        descriptionRu: "Вставка новой записи в таблицу. Возвращает созданную запись с её ID.",
        params: [
          { name: "table", type: "string", description: "Target table name", descriptionRu: "Имя целевой таблицы", required: true },
          { name: "data", type: "object", description: "Key-value pairs of column names and values", descriptionRu: "Пары ключ-значение имён колонок и значений", required: true },
        ],
      },
    ],
  },
  {
    id: "figma",
    name: "Figma",
    description: "Access design files, components, styles, and assets from Figma through the MCP server.",
    descriptionRu: "Доступ к дизайн-файлам, компонентам, стилям и ассетам из Figma через MCP-сервер.",
    color: "#a78bfa",
    icon: "🎨",
    tools: [
      {
        name: "get_design",
        description: "Get the full design data for a Figma file, including frames, layers, and properties.",
        descriptionRu: "Получение полных данных дизайна файла Figma, включая фреймы, слои и свойства.",
        params: [
          { name: "file_key", type: "string", description: "Figma file key from the URL", descriptionRu: "Ключ файла Figma из URL", required: true },
          { name: "node_id", type: "string", description: "Specific node ID to retrieve (optional)", descriptionRu: "ID конкретного узла (опционально)", required: false },
        ],
      },
      {
        name: "list_components",
        description: "List all components in a Figma file with their names, descriptions, and properties.",
        descriptionRu: "Список всех компонентов в файле Figma с их именами, описаниями и свойствами.",
        params: [
          { name: "file_key", type: "string", description: "Figma file key from the URL", descriptionRu: "Ключ файла Figma из URL", required: true },
        ],
      },
      {
        name: "export_asset",
        description: "Export an asset from Figma as SVG, PNG, JPG, or PDF at the requested scale.",
        descriptionRu: "Экспорт ассета из Figma в SVG, PNG, JPG или PDF с заданным масштабом.",
        params: [
          { name: "file_key", type: "string", description: "Figma file key", descriptionRu: "Ключ файла Figma", required: true },
          { name: "node_id", type: "string", description: "Node ID of the asset to export", descriptionRu: "ID узла ассета для экспорта", required: true },
          { name: "format", type: "string", description: "Export format: svg, png, jpg, or pdf", descriptionRu: "Формат экспорта: svg, png, jpg или pdf", required: true },
        ],
      },
      {
        name: "get_styles",
        description: "Get color styles, text styles, and effect styles defined in the Figma file.",
        descriptionRu: "Получение цветовых, текстовых стилей и стилей эффектов, определённых в файле Figma.",
        params: [
          { name: "file_key", type: "string", description: "Figma file key from the URL", descriptionRu: "Ключ файла Figma из URL", required: true },
        ],
      },
    ],
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Search, list, download, and share files from Google Drive through the MCP server.",
    descriptionRu: "Поиск, просмотр, скачивание и предоставление доступа к файлам Google Drive через MCP-сервер.",
    color: "#22c55e",
    icon: "📂",
    tools: [
      {
        name: "search_files",
        description: "Search files in Google Drive by name, type, or content. Returns matching files with metadata.",
        descriptionRu: "Поиск файлов в Google Drive по имени, типу или содержимому. Возвращает совпадающие файлы с метаданными.",
        params: [
          { name: "query", type: "string", description: "Search query string", descriptionRu: "Строка поискового запроса", required: true },
          { name: "mime_type", type: "string", description: "Filter by MIME type (e.g. application/pdf)", descriptionRu: "Фильтр по MIME-типу (напр. application/pdf)", required: false },
        ],
      },
      {
        name: "download_file",
        description: "Download a file from Google Drive by file ID. Returns the file content.",
        descriptionRu: "Скачивание файла из Google Drive по ID файла. Возвращает содержимое файла.",
        params: [
          { name: "file_id", type: "string", description: "ID of the file to download", descriptionRu: "ID файла для скачивания", required: true },
        ],
      },
      {
        name: "list_folder",
        description: "List contents of a Google Drive folder by folder ID. Returns files and subfolders.",
        descriptionRu: "Список содержимого папки Google Drive по ID папки. Возвращает файлы и подпапки.",
        params: [
          { name: "folder_id", type: "string", description: "ID of the folder to list (default: root)", descriptionRu: "ID папки для просмотра (по умолчанию: корень)", required: true },
        ],
      },
      {
        name: "share_file",
        description: "Share a file with a user or group by email, with specified permission level.",
        descriptionRu: "Предоставление доступа к файлу пользователю или группе по email с указанным уровнем прав.",
        params: [
          { name: "file_id", type: "string", description: "ID of the file to share", descriptionRu: "ID файла для предоставления доступа", required: true },
          { name: "email", type: "string", description: "Email of the user to share with", descriptionRu: "Email пользователя для предоставления доступа", required: true },
          { name: "role", type: "string", description: "Permission role: reader, writer, or owner", descriptionRu: "Уровень прав: reader, writer или owner", required: true },
        ],
      },
    ],
  },
];

export const queryExamples: QueryExample[] = [
  {
    id: "github-search",
    serverId: "github",
    label: "Search TypeScript repos about AI",
    labelRu: "Поиск TypeScript-репозиториев по AI",
    query: "Find popular TypeScript repositories related to artificial intelligence and machine learning.",
    queryRu: "Найди популярные TypeScript-репозитории, связанные с искусственным интеллектом и машинным обучением.",
  },
  {
    id: "github-issue",
    serverId: "github",
    label: "Create a bug report issue",
    labelRu: "Создать issue с баг-репортом",
    query: "Create an issue in our repo about the login page crashing on Safari with error 'Invalid token'.",
    queryRu: "Создай issue в нашем репо о том, что страница входа падает в Safari с ошибкой 'Invalid token'.",
  },
  {
    id: "filesystem-config",
    serverId: "filesystem",
    label: "Read a config file",
    labelRu: "Прочитать конфигурационный файл",
    query: "Read the package.json file and tell me what dependencies we have.",
    queryRu: "Прочитай файл package.json и скажи, какие у нас зависимости.",
  },
  {
    id: "database-query",
    serverId: "database",
    label: "Query active users",
    labelRu: "Запрос активных пользователей",
    query: "How many active users do we have in the last 30 days? Show me the count.",
    queryRu: "Сколько у нас активных пользователей за последние 30 дней? Покажи количество.",
  },
  {
    id: "figma-components",
    serverId: "figma",
    label: "List design components",
    labelRu: "Список дизайн-компонентов",
    query: "List all button and card components from our design system file.",
    queryRu: "Покажи все компоненты кнопок и карточек из нашего файла дизайн-системы.",
  },
  {
    id: "drive-search",
    serverId: "google-drive",
    label: "Find project proposal doc",
    labelRu: "Найти документ с предложением проекта",
    query: "Search Google Drive for the Q4 product roadmap document.",
    queryRu: "Найди в Google Drive документ с дорожной картой продукта на Q4.",
  },
];

export function getMCPServer(id: string): MCPServer | undefined {
  return mcpServers.find((s) => s.id === id);
}

export function getQueryExample(id: string): QueryExample | undefined {
  return queryExamples.find((q) => q.id === id);
}

type ToolSelectionResult = {
  tool: MCPTool;
  server: MCPServer;
  score: number;
};

export function selectMCPTool(
  query: string,
  server: MCPServer,
  useVagueDescriptions: boolean,
): ToolSelectionResult {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 3);

  const scored = server.tools.map((tool) => {
    const desc = useVagueDescriptions
      ? "Performs operations and returns results."
      : tool.description.toLowerCase();
    const nameLower = tool.name.toLowerCase();

    let score = 0;
    for (const word of queryWords) {
      if (desc.includes(word)) score += 2;
      if (nameLower.includes(word)) score += 3;
    }

    if (server.id === "github") {
      if (queryLower.includes("search") || queryLower.includes("find") || queryLower.includes("repositor")) {
        if (tool.name === "search_repos") score += 5;
      }
      if (queryLower.includes("issue") || queryLower.includes("bug") || queryLower.includes("crash")) {
        if (tool.name === "create_issue") score += 5;
      }
      if (queryLower.includes("pull") || queryLower.includes("pr")) {
        if (tool.name === "list_prs") score += 5;
      }
    }
    if (server.id === "filesystem") {
      if (queryLower.includes("read") || queryLower.includes("content") || queryLower.includes("show")) {
        if (tool.name === "read_file") score += 5;
      }
      if (queryLower.includes("write") || queryLower.includes("create") || queryLower.includes("save")) {
        if (tool.name === "write_file") score += 5;
      }
      if (queryLower.includes("list") || queryLower.includes("show") && queryLower.includes("directory")) {
        if (tool.name === "list_directory") score += 4;
      }
    }
    if (server.id === "database") {
      if (queryLower.includes("query") || queryLower.includes("select") || queryLower.includes("count")) {
        if (tool.name === "query") score += 5;
      }
      if (queryLower.includes("table") && queryLower.includes("list")) {
        if (tool.name === "list_tables") score += 5;
      }
      if (queryLower.includes("schema") || queryLower.includes("describe") || queryLower.includes("column")) {
        if (tool.name === "describe_table") score += 5;
      }
    }
    if (server.id === "figma") {
      if (queryLower.includes("design") || queryLower.includes("file") || queryLower.includes("get")) {
        if (tool.name === "get_design") score += 5;
      }
      if (queryLower.includes("component") || queryLower.includes("list")) {
        if (tool.name === "list_components") score += 5;
      }
      if (queryLower.includes("export") || queryLower.includes("asset") || queryLower.includes("image")) {
        if (tool.name === "export_asset") score += 5;
      }
      if (queryLower.includes("style") || queryLower.includes("color") || queryLower.includes("font")) {
        if (tool.name === "get_styles") score += 5;
      }
    }
    if (server.id === "google-drive") {
      if (queryLower.includes("search") || queryLower.includes("find") || queryLower.includes("look")) {
        if (tool.name === "search_files") score += 5;
      }
      if (queryLower.includes("download") || queryLower.includes("get")) {
        if (tool.name === "download_file") score += 5;
      }
      if (queryLower.includes("list") || queryLower.includes("folder") || queryLower.includes("show")) {
        if (tool.name === "list_folder") score += 4;
      }
      if (queryLower.includes("share") || queryLower.includes("access")) {
        if (tool.name === "share_file") score += 5;
      }
    }

    score = score / Math.max(1, desc.split(/\s+/).length / 10);
    return { tool, score, server };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

export function generateMCPArgs(
  tool: MCPTool,
  query: string,
): Record<string, string> {
  const args: Record<string, string> = {};

  for (const param of tool.params) {
    if (!param.required) continue;

    switch (tool.name) {
      case "search_repos":
        if (param.name === "query") {
          args.query = query.replace(/find\s+|search\s+/i, "").trim();
        }
        break;
      case "create_issue":
        if (param.name === "repo") args.repo = "team/project";
        if (param.name === "title") args.title = "Login page crashes on Safari";
        if (param.name === "body") args.body = "Users report that the login page crashes with 'Invalid token' error on Safari.";
        break;
      case "list_prs":
        if (param.name === "repo") args.repo = "team/project";
        break;
      case "get_file":
        if (param.name === "repo") args.repo = "team/project";
        if (param.name === "path") args.path = "package.json";
        break;
      case "read_file":
        if (param.name === "path") args.path = "/project/package.json";
        break;
      case "write_file":
        if (param.name === "path") args.path = "/project/config.ts";
        if (param.name === "content") args.content = "export const config = { ... }";
        break;
      case "list_directory":
        if (param.name === "path") args.path = "/project/src";
        break;
      case "search_files":
        if (param.name === "path") args.path = "/project";
        if (param.name === "pattern") args.pattern = "*.tsx";
        break;
      case "query":
        if (param.name === "sql") {
          if (query.toLowerCase().includes("active users")) {
            args.sql = "SELECT COUNT(*) as active_users FROM users WHERE last_active > NOW() - INTERVAL '30 days'";
          } else {
            args.sql = `SELECT * FROM data LIMIT 10`;
          }
        }
        break;
      case "list_tables":
        break;
      case "describe_table":
        if (param.name === "table") args.table = "users";
        break;
      case "create_record":
        if (param.name === "table") args.table = "users";
        if (param.name === "data") args.data = JSON.stringify({ name: "New User", email: "user@example.com" });
        break;
      case "get_design":
        if (param.name === "file_key") args.file_key = "abc123xyz";
        break;
      case "list_components":
        if (param.name === "file_key") args.file_key = "abc123xyz";
        break;
      case "export_asset":
        if (param.name === "file_key") args.file_key = "abc123xyz";
        if (param.name === "node_id") args.node_id = "1:24";
        if (param.name === "format") args.format = "svg";
        break;
      case "get_styles":
        if (param.name === "file_key") args.file_key = "abc123xyz";
        break;
      case "search_files":
        if (param.name === "query") {
          args.query = query.replace(/search\s+|find\s+/i, "").trim();
        }
        break;
      case "download_file":
        if (param.name === "file_id") args.file_id = "1abc234";
        break;
      case "list_folder":
        if (param.name === "folder_id") args.folder_id = "root";
        break;
      case "share_file":
        if (param.name === "file_id") args.file_id = "1abc234";
        if (param.name === "email") args.email = "colleague@company.com";
        if (param.name === "role") args.role = "reader";
        break;
    }
  }

  return args;
}

export function executeMCPTool(
  toolName: string,
  serverId: string,
  args: Record<string, string>,
  simulateError: boolean,
): { success: boolean; output: string; error?: string } {
  if (simulateError) {
    return {
      success: false,
      output: "",
      error: getMCPErrorMessage(toolName),
    };
  }

  const output = getMCPToolOutput(toolName, args);
  return { success: true, output };
}

function getMCPErrorMessage(toolName: string): string {
  switch (toolName) {
    case "search_repos":
      return "GitHub API rate limit exceeded. You have made too many requests. Please wait before retrying.";
    case "create_issue":
      return "Repository not found or you do not have permission to create issues. Verify the repo name and your access token.";
    case "list_prs":
      return "Repository not found. Check that the repo exists and your token has read access.";
    case "get_file":
      return "File not found at the specified path. Verify the path and branch name.";
    case "read_file":
      return "Permission denied: cannot read the file. Check file permissions or the path.";
    case "write_file":
      return "Permission denied: cannot write to the directory. The path may be read-only.";
    case "list_directory":
      return "Directory not found or inaccessible. Verify the path exists.";
    case "search_files":
      return "Directory not found. The search root path does not exist.";
    case "query":
      return "Query timeout after 30 seconds. The database is under high load. Simplify your query.";
    case "list_tables":
      return "Connection to database lost. The database server may be down.";
    case "describe_table":
      return "Table not found. The specified table does not exist in the database.";
    case "create_record":
      return "Insert failed: unique constraint violation. A record with the same key already exists.";
    case "get_design":
      return "Figma API authentication failed. Your access token may have expired.";
    case "list_components":
      return "File not found. The Figma file key is invalid or the file has been deleted.";
    case "export_asset":
      return "Export failed: node not found. The specified node ID does not exist in the file.";
    case "get_styles":
      return "Figma API rate limit exceeded. Wait before making more requests.";
    case "download_file":
      return "Download failed: file not found. The file ID may be incorrect or the file was deleted.";
    case "list_folder":
      return "Folder not found. The folder ID is invalid or the folder has been deleted.";
    case "share_file":
      return "Share failed: user not found. The email address is not associated with a Google account.";
    default:
      return "Tool execution failed due to an internal server error.";
  }
}

function getMCPToolOutput(
  toolName: string,
  args: Record<string, string>,
): string {
  switch (toolName) {
    case "search_repos":
      return JSON.stringify({
        results: [
          { name: "langchain-ai/langchain", stars: 98500, language: "TypeScript", description: "Build context-aware reasoning applications" },
          { name: "microsoft/TypeChat", stars: 8500, language: "TypeScript", description: "Type-safe natural language interfaces" },
          { name: "vercel/ai", stars: 9200, language: "TypeScript", description: "Build AI-powered applications with React and Svelte" },
        ],
        total_found: 142,
      }, null, 2);

    case "create_issue":
      return JSON.stringify({
        issue_number: 482,
        title: args.title || "Untitled",
        state: "open",
        url: `https://github.com/${args.repo || "team/project"}/issues/482`,
        created_at: new Date().toISOString(),
      }, null, 2);

    case "list_prs":
      return JSON.stringify({
        pull_requests: [
          { number: 156, title: "Fix login page Safari crash", author: "alex-dev", state: "open" },
          { number: 155, title: "Add dark mode support", author: "maria-ui", state: "open" },
          { number: 154, title: "Update dependencies", author: "dependabot", state: "open" },
        ],
        total_open: 3,
      }, null, 2);

    case "get_file":
      return JSON.stringify(JSON.parse('{"name": "project","version": "1.0.0","dependencies": {"next": "^16.0.0","react": "^19.0.0","zustand": "^5.0.0","next-intl": "^4.0.0"}}'), null, 2);

    case "read_file":
      return `{\n  "name": "project",\n  "version": "1.0.0",\n  "dependencies": {\n    "next": "^16.0.0",\n    "react": "^19.0.0",\n    "zustand": "^5.0.0",\n    "next-intl": "^4.0.0"\n  },\n  "devDependencies": {\n    "typescript": "^5.7.0",\n    "@types/react": "^19.0.0",\n    "tailwindcss": "^4.0.0"\n  }\n}`;

    case "write_file":
      return JSON.stringify({
        status: "written",
        path: args.path || "/unknown",
        bytes_written: (args.content || "").length,
        timestamp: new Date().toISOString(),
      }, null, 2);

    case "list_directory":
      return JSON.stringify({
        path: args.path || "/project/src",
        entries: [
          { name: "components", type: "directory", size: "-", permissions: "drwxr-xr-x" },
          { name: "lib", type: "directory", size: "-", permissions: "drwxr-xr-x" },
          { name: "store", type: "directory", size: "-", permissions: "drwxr-xr-x" },
          { name: "types", type: "directory", size: "-", permissions: "drwxr-xr-x" },
          { name: "app", type: "directory", size: "-", permissions: "drwxr-xr-x" },
          { name: "i18n", type: "directory", size: "-", permissions: "drwxr-xr-x" },
        ],
        total: 6,
      }, null, 2);

    case "search_files":
      return JSON.stringify({
        pattern: args.pattern || "*",
        path: args.path || "/project",
        matches: [
          { file: "src/components/scenes/rag/RagScene.tsx", size: "8.2 KB", modified: "2026-05-20" },
          { file: "src/components/scenes/embeddings/EmbeddingsScene.tsx", size: "4.5 KB", modified: "2026-05-18" },
          { file: "src/components/layout/Header.tsx", size: "2.1 KB", modified: "2026-05-15" },
        ],
        total_matches: 24,
      }, null, 2);

    case "query":
      return JSON.stringify({
        rows: [{ active_users: 2847 }],
        query_time_ms: 42,
        rows_returned: 1,
        columns: ["active_users"],
      }, null, 2);

    case "list_tables":
      return JSON.stringify({
        tables: [
          { name: "users", rows: 15420, size: "24 MB" },
          { name: "projects", rows: 342, size: "2.1 MB" },
          { name: "tasks", rows: 8910, size: "8.7 MB" },
          { name: "analytics", rows: 452000, size: "156 MB" },
        ],
        total: 4,
      }, null, 2);

    case "describe_table":
      return JSON.stringify({
        table: args.table || "users",
        columns: [
          { name: "id", type: "uuid", nullable: false, default: "gen_random_uuid()" },
          { name: "email", type: "varchar(255)", nullable: false, default: null },
          { name: "name", type: "varchar(100)", nullable: true, default: null },
          { name: "last_active", type: "timestamptz", nullable: true, default: "now()" },
          { name: "created_at", type: "timestamptz", nullable: false, default: "now()" },
        ],
        indexes: ["users_pkey", "users_email_idx", "users_last_active_idx"],
      }, null, 2);

    case "create_record":
      return JSON.stringify({
        id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        table: args.table || "unknown",
        created_at: new Date().toISOString(),
      }, null, 2);

    case "get_design":
      return JSON.stringify({
        file_key: args.file_key || "unknown",
        name: "Design System v3",
        last_modified: "2026-05-25T14:30:00Z",
        frames: [
          { id: "1:1", name: "Login Screen", type: "FRAME" },
          { id: "1:24", name: "Dashboard", type: "FRAME" },
          { id: "2:5", name: "Settings", type: "FRAME" },
        ],
      }, null, 2);

    case "list_components":
      return JSON.stringify({
        components: [
          { id: "3:1", name: "Button/Primary", description: "Primary action button", properties: ["label", "size", "disabled"] },
          { id: "3:8", name: "Button/Secondary", description: "Secondary action button", properties: ["label", "size"] },
          { id: "4:2", name: "Card/Default", description: "Standard card container", properties: ["title", "padding", "shadow"] },
          { id: "5:1", name: "Input/Text", description: "Text input field", properties: ["placeholder", "error", "disabled"] },
        ],
        total: 48,
      }, null, 2);

    case "export_asset":
      return JSON.stringify({
        asset_url: `https://figma.com/export/${args.file_key}/${args.node_id}.${args.format || "svg"}?scale=2`,
        format: args.format || "svg",
        size: "124 KB",
        exported_at: new Date().toISOString(),
      }, null, 2);

    case "get_styles":
      return JSON.stringify({
        colors: [
          { name: "primary/500", value: "#3b82f6" },
          { name: "accent/500", value: "#f0a500" },
          { name: "neutral/100", value: "#f5f5f5" },
          { name: "neutral/900", value: "#0a0a0f" },
        ],
        text_styles: [
          { name: "Heading/XL", fontFamily: "Inter", fontSize: 32, fontWeight: 700 },
          { name: "Body/Default", fontFamily: "Inter", fontSize: 16, fontWeight: 400 },
        ],
        total: 24,
      }, null, 2);

    case "download_file":
      return JSON.stringify({
        file_id: args.file_id || "unknown",
        name: "Q4_Roadmap.pdf",
        mime_type: "application/pdf",
        size: "2.4 MB",
        download_url: `https://drive.google.com/uc?id=${args.file_id || "1abc234"}`,
      }, null, 2);

    case "list_folder":
      return JSON.stringify({
        folder_id: args.folder_id || "root",
        files: [
          { id: "1abc", name: "Q4_Roadmap.pdf", mime_type: "application/pdf", size: "2.4 MB" },
          { id: "2def", name: "Design_Review.pptx", mime_type: "application/vnd.google-apps.presentation", size: "5.1 MB" },
          { id: "3ghi", name: "Meeting_Notes", mime_type: "application/vnd.google-apps.folder", size: "-" },
        ],
        total: 3,
      }, null, 2);

    case "share_file":
      return JSON.stringify({
        file_id: args.file_id || "unknown",
        shared_with: args.email || "unknown",
        role: args.role || "reader",
        share_link: `https://drive.google.com/file/d/${args.file_id || "1abc234"}`,
        timestamp: new Date().toISOString(),
      }, null, 2);

    default:
      return JSON.stringify({ status: "ok", message: "Tool executed successfully" });
  }
}

export function getDiscoverySteps(server: MCPServer) {
  return [
    {
      step: 1,
      label: "AI Client sends list_tools request",
      labelRu: "AI-клиент отправляет запрос list_tools",
      detail: "The AI client (e.g. Claude Desktop, Cursor) sends a request to list available tools from the MCP server. This is the discovery handshake.",
      detailRu: "AI-клиент (например, Claude Desktop, Cursor) отправляет запрос на получение списка доступных инструментов от MCP-сервера. Это рукопожатие обнаружения.",
    },
    {
      step: 2,
      label: `MCP Server (${server.name}) responds with capabilities`,
      labelRu: `MCP-сервер (${server.name}) отвечает списком возможностей`,
      detail: `The server responds with ${server.tools.length} available tools: ${server.tools.map(t => t.name).join(", ")}. Each tool includes name, description, and parameter schema.`,
      detailRu: `Сервер отвечает с ${server.tools.length} доступными инструментами: ${server.tools.map(t => t.name).join(", ")}. Каждый инструмент включает имя, описание и схему параметров.`,
    },
    {
      step: 3,
      label: "User sends a request — AI selects a tool",
      labelRu: "Пользователь отправляет запрос — AI выбирает инструмент",
      detail: "The AI analyzes the user's request against all available tool descriptions and selects the best matching tool, generating structured arguments.",
      detailRu: "AI анализирует запрос пользователя на основе всех доступных описаний инструментов и выбирает наиболее подходящий, генерируя структурированные аргументы.",
    },
    {
      step: 4,
      label: "Tool is executed — result returned to AI",
      labelRu: "Инструмент выполняется — результат возвращается AI",
      detail: "The MCP server executes the tool against the external system and returns structured output to the AI client for further processing.",
      detailRu: "MCP-сервер выполняет инструмент во внешней системе и возвращает структурированный вывод AI-клиенту для дальнейшей обработки.",
    },
  ];
}
