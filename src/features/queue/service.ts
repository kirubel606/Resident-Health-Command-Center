import { getLogger } from "@/core/logging";
import type { Patient } from "@/features/patients";
import * as patientService from "@/features/patients";

const logger = getLogger("queue.service");

export async function getQueue(): Promise<Patient[]> {
  logger.info("queue.get_started");
  const allPatients = await patientService.getAllPatients();
  const queue = allPatients.filter((p) => p.status !== "completed");
  logger.info({ count: queue.length }, "queue.get_completed");
  return queue;
}

export async function advancePatient(id: string): Promise<Patient> {
  logger.info({ patientId: id }, "queue.advance_started");
  const patient = await patientService.getPatient(id);

  let nextStatus: Patient["status"];
  if (patient.status === "waiting") {
    nextStatus = "in-progress";
  } else if (patient.status === "in-progress") {
    nextStatus = "completed";
  } else {
    logger.warn({ patientId: id, currentStatus: patient.status }, "queue.advance_invalid_status");
    return patient;
  }

  const updated = await patientService.updatePatient(id, { status: nextStatus });
  logger.info({ patientId: id, from: patient.status, to: nextStatus }, "queue.advance_completed");
  return updated;
}

export async function updatePriority(id: string, score: number): Promise<Patient> {
  logger.info({ patientId: id, score }, "queue.priority_update_started");
  const updated = await patientService.updatePatient(id, { priorityScore: score });
  logger.info({ patientId: id, score }, "queue.priority_update_completed");
  return updated;
}
