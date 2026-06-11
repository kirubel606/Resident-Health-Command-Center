import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { carePlans } from "@/core/database/schema";

export type CarePlan = InferSelectModel<typeof carePlans>;
export type NewCarePlan = InferInsertModel<typeof carePlans>;

export { carePlans };
