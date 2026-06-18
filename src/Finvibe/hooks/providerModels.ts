export const PROVIDER_MODELS: Record<string, { label: string; models: string[]; defaultModel: string }> = {
  CLAUDE: {
    label: 'Anthropic Claude',
    models: ['claude-opus-4-5', 'claude-3-7-sonnet-20250219', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-opus-4-5',
  },
  OPENAI: {
    label: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1', 'o1-mini', 'o3-mini'],
    defaultModel: 'gpt-4o',
  },
  AZURE_OPENAI: {
    label: 'Azure OpenAI',
    models: [],
    defaultModel: '',
  },
  GEMINI: {
    label: 'Google Gemini',
    models: ['gemini-2.0-flash', 'gemini-2.0-pro', 'gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-1.0-pro'],
    defaultModel: 'gemini-2.0-flash',
  },
  GROK: {
    label: 'xAI Grok',
    models: ['grok-3', 'grok-3-mini', 'grok-2', 'grok-2-mini'],
    defaultModel: 'grok-3',
  },
  OLLAMA: {
    label: 'Ollama (Local)',
    models: [],
    defaultModel: 'llama3',
  },
  DEEPSEEK: {
    label: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder', 'deepseek-r1'],
    defaultModel: 'deepseek-chat',
  },
  MISTRAL: {
    label: 'Mistral AI',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest', 'codestral-latest', 'open-mistral-nemo'],
    defaultModel: 'mistral-large-latest',
  },
  COHERE: {
    label: 'Cohere',
    models: ['command-r-plus', 'command-r', 'command', 'command-light'],
    defaultModel: 'command-r-plus',
  },
  BEDROCK: {
    label: 'AWS Bedrock',
    models: ['anthropic.claude-3-5-sonnet-20241022-v2:0', 'amazon.titan-text-premier-v1:0', 'meta.llama3-70b-instruct-v1:0', 'mistral.mistral-large-2402-v1:0'],
    defaultModel: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
  },
  PERPLEXITY: {
    label: 'Perplexity AI',
    models: ['llama-3.1-sonar-large-128k-online', 'llama-3.1-sonar-small-128k-online', 'llama-3.1-70b-instruct'],
    defaultModel: 'llama-3.1-sonar-large-128k-online',
  },
  GROQ: {
    label: 'Groq',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    defaultModel: 'llama-3.3-70b-versatile',
  },
  TOGETHER: {
    label: 'Together AI',
    models: ['meta-llama/Llama-3-70b-chat-hf', 'mistralai/Mixtral-8x22B-Instruct-v0.1', 'Qwen/Qwen2.5-72B-Instruct-Turbo'],
    defaultModel: 'meta-llama/Llama-3-70b-chat-hf',
  },
  HUGGINGFACE: {
    label: 'HuggingFace Inference',
    models: [],
    defaultModel: '',
  },
};

export const BACKEND_STACKS = [
  { value: 'JAVA_SPRING',   label: 'Java Spring Boot',    recommended: true  },
  { value: 'NODEJS',        label: 'Node.js Express',     recommended: false },
  { value: 'NODEJS_NEST',   label: 'Node.js NestJS',      recommended: false },
  { value: 'PYTHON',        label: 'Python FastAPI',      recommended: false },
  { value: 'PYTHON_DJANGO', label: 'Python Django',       recommended: false },
  { value: 'PYTHON_FLASK',  label: 'Python Flask',        recommended: false },
  { value: 'DOTNET',        label: '.NET Core (C#)',       recommended: false },
  { value: 'GOLANG',        label: 'Go (Golang)',          recommended: false },
  { value: 'RUST',          label: 'Rust (Actix)',         recommended: false },
  { value: 'RUBY_RAILS',    label: 'Ruby on Rails',       recommended: false },
  { value: 'PHP_LARAVEL',   label: 'PHP Laravel',         recommended: false },
  { value: 'KOTLIN_SPRING', label: 'Kotlin Spring Boot',  recommended: false },
  { value: 'SCALA_PLAY',    label: 'Scala Play',          recommended: false },
  { value: 'ELIXIR',        label: 'Elixir Phoenix',      recommended: false },
];

export const FRONTEND_STACKS = [
  { value: 'REACT_TS',    label: 'React TypeScript',      recommended: true  },
  { value: 'REACT_JS',    label: 'React JavaScript',      recommended: false },
  { value: 'NEXTJS',      label: 'Next.js',               recommended: false },
  { value: 'ANGULAR',     label: 'Angular',               recommended: false },
  { value: 'VUE',         label: 'Vue.js',                recommended: false },
  { value: 'NUXT',        label: 'Nuxt.js',               recommended: false },
  { value: 'SVELTE',      label: 'Svelte / SvelteKit',    recommended: false },
  { value: 'SOLID',       label: 'SolidJS',               recommended: false },
  { value: 'ASTRO',       label: 'Astro',                 recommended: false },
  { value: 'REMIX',       label: 'Remix',                 recommended: false },
  { value: 'REACT_NATIVE',label: 'React Native (Mobile)', recommended: false },
  { value: 'FLUTTER',     label: 'Flutter (Dart)',         recommended: false },
  { value: 'IONIC',       label: 'Ionic',                 recommended: false },
  { value: 'VANILLA_JS',  label: 'Vanilla JS / HTML',     recommended: false },
];

export const DATABASE_TYPES = [
  { value: 'POSTGRESQL',  label: 'PostgreSQL',        recommended: true  },
  { value: 'MYSQL',       label: 'MySQL',             recommended: false },
  { value: 'ORACLE',      label: 'Oracle',            recommended: false },
  { value: 'MSSQL',       label: 'SQL Server',        recommended: false },
  { value: 'MONGODB',     label: 'MongoDB',           recommended: false },
  { value: 'REDIS',       label: 'Redis',             recommended: false },
  { value: 'CASSANDRA',   label: 'Cassandra',         recommended: false },
  { value: 'DYNAMODB',    label: 'DynamoDB (AWS)',     recommended: false },
  { value: 'FIRESTORE',   label: 'Firestore (GCP)',   recommended: false },
  { value: 'SQLITE',      label: 'SQLite',            recommended: false },
  { value: 'ELASTIC',     label: 'Elasticsearch',     recommended: false },
  { value: 'SUPABASE',    label: 'Supabase (Postgres)',recommended: false },
];