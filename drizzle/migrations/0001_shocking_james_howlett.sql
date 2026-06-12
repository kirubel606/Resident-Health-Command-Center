CREATE TYPE "public"."user_role" AS ENUM('staff', 'nurse');--> statement-breakpoint
ALTER TABLE "care_plans" ALTER COLUMN "patient_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "care_plans" ADD COLUMN "caretaker_name" text;--> statement-breakpoint
ALTER TABLE "care_plans" ADD COLUMN "attendant_name" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "appointment_time" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'staff' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");