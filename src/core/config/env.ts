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
} as const;

export type Env = typeof env;
