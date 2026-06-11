/**
 * Feature Flags Configuration
 *
 * In a real app, these might come from a DB or an external service (e.g. LaunchDarkly).
 * For this MVP, we use environment variables with defaults.
 */
export const flags = {
  aiTriage: process.env["NEXT_PUBLIC_FF_AI_TRIAGE"] === "true",
  emailReminders: process.env["NEXT_PUBLIC_FF_EMAIL_REMINDERS"] === "true",
  carePlanV2: process.env["NEXT_PUBLIC_FF_CARE_PLAN_V2"] === "true",
} as const;

export type Flags = typeof flags;

/**
 * Check if a feature is enabled.
 */
export function isEnabled(flag: keyof Flags): boolean {
  return flags[flag];
}
