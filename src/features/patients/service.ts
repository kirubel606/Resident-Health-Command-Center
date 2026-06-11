import { getLogger } from "@/core/logging";
import { computePriority } from "@/features/triage/service";
import { PatientNotFoundError } from "./errors";
import type { Patient } from "./models";
import * as repository from "./repository";
import type { CreatePatientInput, UpdatePatientInput } from "./schemas";
import { CreatePatientSchema, UpdatePatientSchema } from "./schemas";

const logger = getLogger("patients.service");

export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const validated = CreatePatientSchema.parse(input);

  logger.info({ name: validated.name }, "patient.create_started");

  try {
    const priorityScore = await computePriority(validated.symptoms);

    const patient = await repository.create({
      ...validated,
      priorityScore,
      status: "waiting",
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
