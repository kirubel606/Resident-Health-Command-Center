import { isEnabled } from "@/core/config/flags";
import { getLogger } from "@/core/logging";
import { env } from "@/core/config/env";

const logger = getLogger("triage.service");

/**
 * Simple rule-based triage.
 */
function computeRuleBasedPriority(symptoms: string): number {
  const lowercase = symptoms.toLowerCase();
  let score = 1;

  // Improved keyword matching for higher severity
  if (
    lowercase.includes("chest pain") || 
    lowercase.includes("breathing") || 
    lowercase.includes("short breath") || 
    lowercase.includes("blood")
  ) {
    score = 10;
  } else if (
    lowercase.includes("bleeding") || 
    lowercase.includes("fever") ||
    lowercase.includes("vision")
  ) {
    score = 7;
  } else if (
    lowercase.includes("pain") || 
    lowercase.includes("cough")
  ) {
    score = 4;
  }

  logger.info({ score, method: "rules" }, "triage.compute_completed");
  return score;
}

/**
 * AI-assisted triage using Ollama.
 */
async function computeAiPriority(symptoms: string): Promise<number | null> {
  try {
    const response = await fetch(`${env.OLLAMA_BASE_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.OLLAMA_MODEL,
        prompt: `You are a clinical triage assistant. Based on the following patient symptoms, return a JSON object with a single field "priority" rated 1 (lowest) to 5 (highest). Return ONLY valid JSON, no explanation.\n\nSymptoms: ${symptoms}`,
        stream: false,
        format: "json",
      }),
      // Add a reasonable timeout for AI generation
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse the response, handling potential formatting issues
    let result;
    try {
        result = JSON.parse(data.response);
    } catch (e) {
        logger.error({ error: e, response: data.response }, "Failed to parse AI JSON response");
        return null;
    }
    
    if (typeof result.priority !== "number" || result.priority < 1 || result.priority > 5) {
      logger.error({ result }, "AI returned invalid priority range");
      return null;
    }

    // Map 1-5 scale to 1-10 scale
    const score = Math.min(result.priority * 2, 10);
    logger.info({ score, method: "ai" }, "triage.compute_completed");
    return score;
  } catch (err) {
    logger.error({ err }, "triage.ai_failed_fallback_to_rules");
    return null;
  }
}

/**
 * Compute priority score (1-10) for a patient based on symptoms.
 * 10 = most urgent.
 */
export async function computePriority(symptoms: string): Promise<number> {
  logger.info({ symptomsLength: symptoms.length }, "triage.compute_started");

  if (isEnabled("aiTriage")) {
    const aiPriority = await computeAiPriority(symptoms);
    if (aiPriority !== null) {
        return aiPriority;
    }
    logger.warn("AI triage failed or returned null, falling back to rules");
  }

  return computeRuleBasedPriority(symptoms);
}
