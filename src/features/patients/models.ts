import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { patients } from "@/core/database/schema";

export type Patient = InferSelectModel<typeof patients>;
export type NewPatient = InferInsertModel<typeof patients>;

export { patients };
