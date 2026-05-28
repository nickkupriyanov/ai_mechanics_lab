export type ToolReliability = "good" | "poor";

export type AgentStep = {
  id: string;
  action: string;
  actionRu: string;
  toolName: string;
  toolArgs: Record<string, string>;
  observation: string;
  observationRu: string;
  errorObservation: string;
  errorObservationRu: string;
  reflection: string;
  reflectionRu: string;
  isComplete: boolean;
};

export type AgentScenario = {
  id: string;
  goal: string;
  goalRu: string;
  steps: AgentStep[];
};

export const agentScenarios: AgentScenario[] = [
  {
    id: "find-restaurant",
    goal: "Find a good Italian restaurant nearby and book a table",
    goalRu: "Найти хороший итальянский ресторан поблизости и забронировать столик",
    steps: [
      {
        id: "step-1",
        action: "Search for Italian restaurants nearby",
        actionRu: "Поиск итальянских ресторанов поблизости",
        toolName: "search_restaurants",
        toolArgs: { query: "Italian", location: "nearby" },
        observation:
          "Found 3 Italian restaurants: Bella Italia (4.5★), Mario's (4.2★), Pasta House (3.8★)",
        observationRu:
          "Найдено 3 итальянских ресторана: Bella Italia (4.5★), Mario's (4.2★), Pasta House (3.8★)",
        errorObservation:
          "Search API returned empty results. The restaurant database may be temporarily unavailable.",
        errorObservationRu:
          "API поиска вернул пустые результаты. База ресторанов может быть временно недоступна.",
        reflection:
          "Bella Italia has the highest rating. Next: check availability.",
        reflectionRu:
          "У Bella Italia самый высокий рейтинг. Далее: проверить доступность.",
        isComplete: false,
      },
      {
        id: "step-2",
        action: "Check table availability at Bella Italia",
        actionRu: "Проверить доступность столиков в Bella Italia",
        toolName: "check_availability",
        toolArgs: { restaurant: "Bella Italia", date: "today", party: "2" },
        observation:
          "Bella Italia has tables available at 18:00, 19:00, and 20:30 for 2 people.",
        observationRu:
          "Bella Italia: есть столики на 18:00, 19:00 и 20:30 на двоих.",
        errorObservation:
          "Availability check failed — reservation system is unreachable.",
        errorObservationRu:
          "Проверка доступности не удалась — система бронирования недоступна.",
        reflection:
          "Available today. 19:00 is a good time. Next: book the table.",
        reflectionRu:
          "Доступно сегодня. 19:00 — хорошее время. Далее: забронировать столик.",
        isComplete: false,
      },
      {
        id: "step-3",
        action: "Book a table at Bella Italia",
        actionRu: "Забронировать столик в Bella Italia",
        toolName: "book_table",
        toolArgs: { restaurant: "Bella Italia", time: "19:00", party: "2" },
        observation:
          "Table booked at Bella Italia for today at 19:00 for 2 people. Booking ID: #BK-4821.",
        observationRu:
          "Столик забронирован в Bella Italia на сегодня в 19:00 на двоих. Номер брони: #BK-4821.",
        errorObservation:
          "Booking failed — Bella Italia has no tables available at 19:00. Try a different time.",
        errorObservationRu:
          "Бронирование не удалось — в Bella Italia нет столиков на 19:00. Попробуйте другое время.",
        reflection:
          "Table booked successfully. Goal achieved.",
        reflectionRu:
          "Столик успешно забронирован. Цель достигнута.",
        isComplete: true,
      },
    ],
  },
  {
    id: "debug-bug",
    goal: "Debug the login error in production",
    goalRu: "Отладить ошибку входа в продакшене",
    steps: [
      {
        id: "step-1",
        action: "Check production logs for login errors",
        actionRu: "Проверить продакшен-логи на ошибки входа",
        toolName: "check_logs",
        toolArgs: { service: "auth", level: "error", hours: "24" },
        observation:
          "Found 47 login failures in last 24h. All show 'Invalid session token' at /api/auth/login. Error rate spiked after deploy v2.4.1.",
        observationRu:
          "Найдено 47 ошибок входа за 24ч. Все показывают 'Invalid session token' на /api/auth/login. Частота ошибок выросла после деплоя v2.4.1.",
        errorObservation:
          "Log service timed out. Unable to retrieve logs. Try reducing the time range.",
        errorObservationRu:
          "Сервис логов превысил таймаут. Не удалось получить логи. Попробуйте уменьшить временной диапазон.",
        reflection:
          "Error correlates with deploy v2.4.1. Next: search codebase for session token changes.",
        reflectionRu:
          "Ошибка коррелирует с деплоем v2.4.1. Далее: поиск изменений токена сессии в коде.",
        isComplete: false,
      },
      {
        id: "step-2",
        action: "Search codebase for session token changes",
        actionRu: "Поиск изменений токена сессии в коде",
        toolName: "search_codebase",
        toolArgs: { query: "session token", since: "v2.4.1" },
        observation:
          "Found commit abc1234: 'refactor auth middleware'. Changed session token format from JWT to opaque tokens. Token verification function in auth/middleware.ts:42 now expects 'st_' prefix, but old tokens don't have it.",
        observationRu:
          "Найден коммит abc1234: 'refactor auth middleware'. Изменён формат токена сессии с JWT на opaque-токены. Функция проверки в auth/middleware.ts:42 теперь ожидает префикс 'st_', но старые токены его не имеют.",
        errorObservation:
          "Codebase search is indexing — results incomplete. Try again in a few minutes.",
        errorObservationRu:
          "Поиск по коду индексируется — результаты неполные. Попробуйте через несколько минут.",
        reflection:
          "Root cause found: token format changed but migration didn't handle existing sessions. Next: write a test to confirm.",
        reflectionRu:
          "Найдена первопричина: формат токена изменился, но миграция не обработала существующие сессии. Далее: написать тест для подтверждения.",
        isComplete: false,
      },
      {
        id: "step-3",
        action: "Run tests against the auth middleware",
        actionRu: "Запустить тесты middleware аутентификации",
        toolName: "run_tests",
        toolArgs: { target: "auth/middleware", include: "session_token" },
        observation:
          "Test 'old format tokens should be accepted' FAILED. Test 'new format tokens should be accepted' PASSED. Migration test missing.",
        observationRu:
          "Тест 'old format tokens should be accepted' НЕ ПРОЙДЕН. Тест 'new format tokens should be accepted' ПРОЙДЕН. Тест миграции отсутствует.",
        errorObservation:
          "Test runner crashed. Environment variables missing for test database.",
        errorObservationRu:
          "Запуск тестов упал. Отсутствуют переменные окружения для тестовой базы данных.",
        reflection:
          "Confirmed: migration test missing. Next: create a fix that handles both token formats.",
        reflectionRu:
          "Подтверждено: тест миграции отсутствует. Далее: создать исправление с поддержкой обоих форматов токенов.",
        isComplete: false,
      },
      {
        id: "step-4",
        action: "Deploy fix with backward-compatible token validation",
        actionRu: "Задеплоить исправление с обратно-совместимой проверкой токенов",
        toolName: "fix_deploy",
        toolArgs: { commit: "def5678", message: "fix: accept both JWT and opaque session tokens" },
        observation:
          "Deployed fix to production. Login errors dropped to 0 within 5 minutes. Monitoring shows normal auth flow for all users.",
        observationRu:
          "Исправление задеплоено в продакшен. Ошибки входа упали до 0 за 5 минут. Мониторинг показывает нормальный поток аутентификации для всех пользователей.",
        errorObservation:
          "Deploy failed — CI pipeline blocked due to missing approval. Manual deploy required.",
        errorObservationRu:
          "Деплой не удался — CI-пайплайн заблокирован из-за отсутствия подтверждения. Требуется ручной деплой.",
        reflection:
          "Bug resolved. Token format change should always include backward compatibility for active sessions.",
        reflectionRu:
          "Баг исправлен. Изменение формата токена всегда должно включать обратную совместимость для активных сессий.",
        isComplete: true,
      },
    ],
  },
  {
    id: "research-topic",
    goal: "Research and summarize recent papers about attention mechanisms",
    goalRu: "Исследовать и обобщить недавние статьи о механизмах внимания",
    steps: [
      {
        id: "step-1",
        action: "Search for recent papers on attention mechanisms",
        actionRu: "Поиск недавних статей о механизмах внимания",
        toolName: "search_papers",
        toolArgs: { query: "attention mechanisms transformers", year: "2025", limit: "10" },
        observation:
          "Found 10 papers. Top 3: (1) 'Linformer: Linear Attention for Long Sequences' (2025), (2) 'FlashAttention-4: Hardware-Aware Attention' (2025), (3) 'Sparse Mixture of Attention Heads' (2025).",
        observationRu:
          "Найдено 10 статей. Топ-3: (1) 'Linformer: Linear Attention for Long Sequences' (2025), (2) 'FlashAttention-4: Hardware-Aware Attention' (2025), (3) 'Sparse Mixture of Attention Heads' (2025).",
        errorObservation:
          "Paper search returned 0 results. ArXiv API may be rate-limited. Try a narrower query.",
        errorObservationRu:
          "Поиск статей вернул 0 результатов. ArXiv API может быть ограничен по частоте. Попробуйте более узкий запрос.",
        reflection:
          "Three strong papers found covering efficiency, hardware optimization, and sparsity. Next: read abstracts and extract key findings.",
        reflectionRu:
          "Найдены три сильные статьи по эффективности, аппаратной оптимизации и разреженности. Далее: прочитать аннотации и извлечь ключевые выводы.",
        isComplete: false,
      },
      {
        id: "step-2",
        action: "Read and extract key findings from top papers",
        actionRu: "Прочитать и извлечь ключевые выводы из лучших статей",
        toolName: "extract_findings",
        toolArgs: { paper_ids: "paper-1,paper-2,paper-3", sections: "abstract,conclusion" },
        observation:
          "Key findings: (1) Linformer reduces attention complexity from O(n²) to O(n) using low-rank projection; (2) FlashAttention-4 achieves 3.2x speedup on H200 GPUs; (3) Sparse MoA dynamically selects 2-4 attention heads per token.",
        observationRu:
          "Ключевые выводы: (1) Linformer снижает сложность внимания с O(n²) до O(n) с помощью низкоранговой проекции; (2) FlashAttention-4 даёт ускорение в 3.2x на H200 GPU; (3) Sparse MoA динамически выбирает 2-4 головы внимания на токен.",
        errorObservation:
          "Paper extraction failed — PDFs are behind a paywall. Only abstracts are available.",
        errorObservationRu:
          "Извлечение не удалось — PDF-файлы за paywall. Доступны только аннотации.",
        reflection:
          "Three complementary approaches: mathematical, hardware, and architectural. Next: write summary comparing trade-offs.",
        reflectionRu:
          "Три взаимодополняющих подхода: математический, аппаратный и архитектурный. Далее: написать обзор со сравнением компромиссов.",
        isComplete: false,
      },
      {
        id: "step-3",
        action: "Write comparative summary of approaches",
        actionRu: "Написать сравнительный обзор подходов",
        toolName: "write_summary",
        toolArgs: { topic: "efficient attention mechanisms", format: "markdown" },
        observation:
          "Summary written: covers 3 papers. Linformer is best for theoretical simplicity, FlashAttention for practical speed, Sparse MoA for flexibility. All three show that full quadratic attention is unnecessary for most tasks.",
        observationRu:
          "Обзор написан: охватывает 3 статьи. Linformer лучше для теоретической простоты, FlashAttention — для практической скорости, Sparse MoA — для гибкости. Все три показывают, что полное квадратичное внимание не нужно для большинства задач.",
        errorObservation:
          "Summary generation failed — LLM context overflowed with too much paper content. Reduce the number of papers.",
        errorObservationRu:
          "Генерация обзора не удалась — контекст LLM переполнен из-за слишком большого объёма статей. Уменьшите количество статей.",
        reflection:
          "Summary complete. All three papers converge on the same insight: efficient attention is sufficient. Next: save to knowledge base.",
        reflectionRu:
          "Обзор завершён. Все три статьи сходятся в одном: эффективного внимания достаточно. Далее: сохранить в базу знаний.",
        isComplete: false,
      },
      {
        id: "step-4",
        action: "Save research summary to knowledge base",
        actionRu: "Сохранить обзор исследования в базу знаний",
        toolName: "save_to_kb",
        toolArgs: { title: "Efficient Attention Mechanisms — Research Summary 2025", tags: "attention,transformers,efficiency" },
        observation:
          "Research summary saved to knowledge base. Tagged: #attention #transformers #efficiency. Available for future queries.",
        observationRu:
          "Обзор сохранён в базе знаний. Теги: #attention #transformers #efficiency. Доступен для будущих запросов.",
        errorObservation:
          "Save to knowledge base failed — storage quota exceeded. Archive older entries first.",
        errorObservationRu:
          "Сохранение в базу знаний не удалось — превышена квота хранилища. Сначала заархивируйте старые записи.",
        reflection:
          "Research task completed. Summary saved and available for future reference.",
        reflectionRu:
          "Исследовательская задача завершена. Обзор сохранён и доступен для будущих обращений.",
        isComplete: true,
      },
    ],
  },
  {
    id: "vague-goal",
    goal: "Help me with stuff",
    goalRu: "Помоги мне с делами",
    steps: [
      {
        id: "step-1",
        action: "Try to interpret vague request",
        actionRu: "Попытка интерпретировать расплывчатый запрос",
        toolName: "search_web",
        toolArgs: { query: "stuff help general" },
        observation:
          "Search for 'stuff help general' returned random results about self-help books, productivity apps, and unrelated forum posts.",
        observationRu:
          "Поиск 'stuff help general' вернул случайные результаты: книги по самопомощи, приложения для продуктивности и нерелевантные форумы.",
        errorObservation:
          "Web search failed — query too vague to generate meaningful results.",
        errorObservationRu:
          "Веб-поиск не удался — запрос слишком расплывчатый для осмысленных результатов.",
        reflection:
          "The request is too vague. I need to ask clarifying questions instead of guessing.",
        reflectionRu:
          "Запрос слишком расплывчатый. Нужно задать уточняющие вопросы, а не гадать.",
        isComplete: false,
      },
      {
        id: "step-2",
        action: "Try random productivity tools",
        actionRu: "Попытка случайных инструментов продуктивности",
        toolName: "create_todo_list",
        toolArgs: { title: "Stuff to do", items: "thing 1, thing 2, etc" },
        observation:
          "Created a todo list with generic items. No real tasks were identified because the goal was never clarified.",
        observationRu:
          "Создан список дел с общими пунктами. Настоящие задачи не были определены, потому что цель так и не была уточнена.",
        errorObservation:
          "Todo list creation failed — no actionable items found in the request.",
        errorObservationRu:
          "Создание списка дел не удалось — в запросе не найдено actionable-пунктов.",
        reflection:
          "Still guessing. Without a clear goal, every action is a shot in the dark. The agent should stop and ask for clarification.",
        reflectionRu:
          "Всё ещё гадаю. Без чёткой цели каждое действие — выстрел наугад. Агент должен остановиться и запросить уточнение.",
        isComplete: false,
      },
      {
        id: "step-3",
        action: "Attempt a generic web search again",
        actionRu: "Повторная попытка общего веб-поиска",
        toolName: "search_web",
        toolArgs: { query: "how to help someone with stuff" },
        observation:
          "Found articles about general helpfulness and life coaching. None are relevant because the specific goal was never defined.",
        observationRu:
          "Найдены статьи об общей полезности и лайф-коучинге. Ничего не релевантно, потому что конкретная цель так и не была определена.",
        errorObservation:
          "Search returned only sponsored content — no useful information.",
        errorObservationRu:
          "Поиск вернул только рекламный контент — никакой полезной информации.",
        reflection:
          "After 3 failed attempts, it's clear: vague goals lead to wasted steps. Agents need specific, measurable goals to be effective.",
        reflectionRu:
          "После 3 неудачных попыток ясно: расплывчатые цели ведут к пустой трате шагов. Агентам нужны конкретные, измеримые цели для эффективной работы.",
        isComplete: true,
      },
    ],
  },
];

export type AgentsPreset = {
  id: string;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  settings: {
    scenarioId: string;
    maxSteps: number;
    enableReflection: boolean;
    toolReliability: ToolReliability;
    enableStopCondition: boolean;
  };
};

export const agentsPresets: AgentsPreset[] = [
  {
    id: "infinite-loop",
    title: "Infinite loop",
    titleRu: "Бесконечный цикл",
    description:
      "Poor tool reliability causes repeated failures. Without a stop condition, the agent loops forever trying to complete its goal.",
    descriptionRu:
      "Низкая надёжность инструментов вызывает повторяющиеся ошибки. Без условия остановки агент зацикливается, пытаясь достичь цели.",
    settings: {
      scenarioId: "find-restaurant",
      maxSteps: 10,
      enableReflection: true,
      toolReliability: "poor",
      enableStopCondition: false,
    },
  },
  {
    id: "wrong-tool",
    title: "Wrong tool",
    titleRu: "Неверный инструмент",
    description:
      "A vague goal leads the agent to select wrong tools. Each step wastes time because the agent never understands what the user actually needs.",
    descriptionRu:
      "Расплывчатая цель заставляет агента выбирать неверные инструменты. Каждый шаг — пустая трата времени, потому что агент не понимает, что на самом деле нужно пользователю.",
    settings: {
      scenarioId: "vague-goal",
      maxSteps: 5,
      enableReflection: true,
      toolReliability: "good",
      enableStopCondition: false,
    },
  },
  {
    id: "vague-goal",
    title: "Vague goal",
    titleRu: "Расплывчатая цель",
    description:
      "With an unclear goal and no reflection, the agent makes 3 pointless attempts before giving up. Reflection would have caught the problem at step 1.",
    descriptionRu:
      "С неясной целью и без рефлексии агент делает 3 бессмысленные попытки, прежде чем сдаться. Рефлексия обнаружила бы проблему на первом шаге.",
    settings: {
      scenarioId: "vague-goal",
      maxSteps: 3,
      enableReflection: false,
      toolReliability: "good",
      enableStopCondition: true,
    },
  },
  {
    id: "no-stop",
    title: "No stop condition",
    titleRu: "Нет условия остановки",
    description:
      "Even with good tools and reflection, without a stop condition the agent keeps running after the goal is achieved. It re-executes completed steps unnecessarily.",
    descriptionRu:
      "Даже с хорошими инструментами и рефлексией, без условия остановки агент продолжает работать после достижения цели. Он повторно выполняет завершённые шаги без необходимости.",
    settings: {
      scenarioId: "find-restaurant",
      maxSteps: 10,
      enableReflection: true,
      toolReliability: "good",
      enableStopCondition: false,
    },
  },
];
