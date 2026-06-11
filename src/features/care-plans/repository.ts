import { desc, eq } from "drizzle-orm";
import { db } from "@/core/database/client";
import type { CarePlan, NewCarePlan } from "./models";
import { carePlans } from "./models";

export async function findByPatientId(patientId: string): Promise<CarePlan[]> {
  return db
    .select()
    .from(carePlans)
    .where(eq(carePlans.patientId, patientId))
    .orderBy(desc(carePlans.createdAt));
}

export async function create(carePlan: NewCarePlan): Promise<CarePlan> {
  const results = await db.insert(carePlans).values(carePlan).returning();
  const created = results[0];
  if (!created) {
    throw new Error("Failed to create care plan");
  }
  return created;
}

export async function update(
  id: string,
  data: Partial<NewCarePlan>,
): Promise<CarePlan | undefined> {
  const results = await db
    .update(carePlans)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(carePlans.id, id))
    .returning();
  return results[0];
}
