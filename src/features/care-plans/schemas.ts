import { z } from "zod/v4";

export const CreateCarePlanSchema = z.object({
  patientId: z.string().uuid(),
  notes: z.string().min(1, "Notes are required"),
  prescriptions: z.string().optional(),
  followUpDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
});

export const UpdateCarePlanSchema = CreateCarePlanSchema.partial().extend({
  status: z.enum(["active", "completed", "archived"]).optional(),
});

export type CreateCarePlanInput = z.infer<typeof CreateCarePlanSchema>;
export type UpdateCarePlanInput = z.infer<typeof UpdateCarePlanSchema>;
