import { getLogger } from "@/core/logging";
import { computePriority } from "@/features/triage/service";
import { PatientNotFoundError } from "./errors";
import type { Patient } from "./models";
import * as repository from "./repository";
import type { CreatePatientInput, UpdatePatientInput } from "./schemas";
import { CreatePatientSchema, UpdatePatientSchema } from "./schemas";

const logger = getLogger("patients.service");

/**
 * Generate a patient ID in the format: PT-{YYYYMMDD}-{3-digit-hash}
 */
function generatePatientId(name: string): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  
  // Simple 3-digit hash using name and current time
  const hashInput = `${name}${now.getTime()}`;
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    hash = (hash << 5) - hash + hashInput.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  const hashStr = Math.abs(hash).toString(36).substring(0, 3).toUpperCase();
  
  return `PT-${dateStr}-${hashStr}`;
}

export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const validated = CreatePatientSchema.parse(input);

  logger.info({ name: validated.name }, "patient.create_started");

  try {
    const priorityScore = await computePriority(validated.symptoms);
    const id = generatePatientId(validated.name);

    const patient = await repository.create({
      ...validated,
      id,
      priorityScore,
      status: "waiting",
      // email and appointmentTime are included in ...validated
    });

    logger.info({ patientId: patient.id, priorityScore }, "patient.create_completed");
    return patient;
  } catch (error) {
    logger.error({ error, name: validated.name }, "patient.create_failed");
    throw error;
  }
}

export async function getPatient(id: string): Promise<Patient> {
  logger.info({ patientId: id }, "patient.get_started");

  const patient = await repository.findById(id);

  if (!patient) {
    logger.warn({ patientId: id }, "patient.get_not_found");
    throw new PatientNotFoundError(id);
  }

  logger.info({ patientId: id }, "patient.get_completed");
  return patient;
}

export async function getAllPatients(): Promise<Patient[]> {
  logger.info("patients.list_started");
  const patients = await repository.findAll();
  logger.info({ count: patients.length }, "patients.list_completed");
  return patients;
}

export async function updatePatient(id: string, input: UpdatePatientInput): Promise<Patient> {
  const validated = UpdatePatientSchema.parse(input);

  logger.info({ patientId: id }, "patient.update_started");

  // Ensure validated input is correctly typed for repository update
  const patient = await repository.update(id, validated as any);

  if (!patient) {
    logger.warn({ patientId: id }, "patient.update_not_found");
    throw new PatientNotFoundError(id);
  }

  logger.info({ patientId: id }, "patient.update_completed");
  return patient;
}

export async function deletePatient(id: string): Promise<void> {
  logger.info({ patientId: id }, "patient.delete_started");

  const deleted = await repository.deleteById(id);

  if (!deleted) {
    logger.warn({ patientId: id }, "patient.delete_not_found");
    throw new PatientNotFoundError(id);
  }

  logger.info({ patientId: id }, "patient.delete_completed");
}
