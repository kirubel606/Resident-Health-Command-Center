import { desc, eq } from "drizzle-orm";
import { db } from "@/core/database/client";
import type { NewPatient, Patient } from "./models";
import { patients } from "./models";

export async function findById(id: string): Promise<Patient | undefined> {
  const results = await db.select().from(patients).where(eq(patients.id, id)).limit(1);
  return results[0];
}

export async function findAll(): Promise<Patient[]> {
  return db.select().from(patients).orderBy(desc(patients.priorityScore), desc(patients.createdAt));
}

export async function create(patient: NewPatient): Promise<Patient> {
  const results = await db.insert(patients).values(patient).returning();
  const created = results[0];
  if (!created) {
    throw new Error("Failed to create patient");
  }
  return created;
}

export async function update(id: string, data: Partial<NewPatient>): Promise<Patient | undefined> {
  const results = await db
    .update(patients)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(patients.id, id))
    .returning();
  return results[0];
}

export async function deleteById(id: string): Promise<boolean> {
  const results = await db.delete(patients).where(eq(patients.id, id)).returning();
  return results.length > 0;
}
