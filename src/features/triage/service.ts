import { isEnabled } from "@/core/config/flags";
import { getLogger } from "@/core/logging";

const logger = getLogger("triage.service");

/**
 * Compute priority score (1-10) for a patient based on symptoms.
 * 10 = most urgent.
 */
export async function computePriority(symptoms: string): Promise<number> {
  logger.info({ symptomsLength: symptoms.length }, "triage.compute_started");

  if (isEnabled("aiTriage")) {
    return computeAiPriority(symptoms);
  }

  return computeRuleBasedPriority(symptoms);
}

/**
 * Simple rule-based triage.
 */
function computeRuleBasedPriority(symptoms: string): number {
  const lowercase = symptoms.toLowerCase();
  let score = 1;

  // Basic keyword matching
  if (lowercase.includes("chest pain") || lowercase.includes("breathing")) {
    score = 10;
  } else if (lowercase.includes("bleeding") || lowercase.includes("fever")) {
    score = 7;
  } else if (lowercase.includes("pain") || lowercase.includes("cough")) {
    score = 4;
  }

  logger.info({ score, method: "rules" }, "triage.compute_completed");
  return score;
}

/**
 * Mock AI-assisted triage.
 */
async function computeAiPriority(symptoms: string): Promise<number> {
  // Simulate AI latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock logic: longer symptoms = higher complexity/priority?
  // In a real app, this would call an LLM (e.g. Gemini).
  const score = Math.min(Math.floor(symptoms.length / 20) + 1, 10);

  logger.info({ score, method: "ai" }, "triage.compute_completed");
  return score;
}
