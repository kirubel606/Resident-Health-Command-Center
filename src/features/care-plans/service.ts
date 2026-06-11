import { getLogger } from "@/core/logging";
import type { CarePlan } from "./models";
import * as repository from "./repository";
import { type CreateCarePlanInput, CreateCarePlanSchema } from "./schemas";

const logger = getLogger("care-plans.service");

export async function createCarePlan(input: CreateCarePlanInput): Promise<CarePlan> {
  const validated = CreateCarePlanSchema.parse(input);
  logger.info({ patientId: validated.patientId }, "care_plan.create_started");

  try {
    const carePlan = await repository.create(validated);
    logger.info({ carePlanId: carePlan.id }, "care_plan.create_completed");
    return carePlan;
  } catch (error) {
    logger.error({ error, patientId: validated.patientId }, "care_plan.create_failed");
    throw error;
  }
}

export async function getPatientCarePlans(patientId: string): Promise<CarePlan[]> {
  logger.info({ patientId }, "care_plan.list_started");
  const plans = await repository.findByPatientId(patientId);
  logger.info({ patientId, count: plans.length }, "care_plan.list_completed");
  return plans;
}
