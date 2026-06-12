function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value && process.env["SKIP_ENV_VALIDATION"] !== "1") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? "";
}

function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  // App config
  NODE_ENV: getOptionalEnv("NODE_ENV", "development"),
  LOG_LEVEL: getOptionalEnv("LOG_LEVEL", "info"),
  APP_NAME: getOptionalEnv("APP_NAME", "ai-opti-nextjs-starter"),

  // Database config (required)
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),

  // Ollama
  OLLAMA_BASE_URL: getOptionalEnv("OLLAMA_BASE_URL", "http://localhost:11434"),
  OLLAMA_MODEL: getOptionalEnv("OLLAMA_MODEL", "llama3.1:8b"),

  // SMTP
  SMTP_HOST: getOptionalEnv("SMTP_HOST", "rhcc-mailpit"),
  SMTP_PORT: getOptionalEnv("SMTP_PORT", "1025"),
  SMTP_USER: getOptionalEnv("SMTP_USER", ""),
  SMTP_PASS: getOptionalEnv("SMTP_PASS", ""),
  SMTP_FROM: getOptionalEnv("SMTP_FROM", "noreply@clinic.local"),
} as const;

export type Env = typeof env;
