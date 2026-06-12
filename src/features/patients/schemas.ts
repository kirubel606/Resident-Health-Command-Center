import { z } from "zod/v4";

export const CreatePatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  contact: z.string().min(1, "Contact information is required"),
  insurance: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  appointmentTime: z.string().optional(),
  symptoms: z.string().min(1, "Symptoms are required"),
});

export const UpdatePatientSchema = CreatePatientSchema.partial().extend({
  status: z.enum(["waiting", "in-progress", "completed"]).optional(),
  priorityScore: z.number().int().min(0).max(10).optional(),
});

export type CreatePatientInput = z.infer<typeof CreatePatientSchema>;
export type UpdatePatientInput = z.infer<typeof UpdatePatientSchema>;
