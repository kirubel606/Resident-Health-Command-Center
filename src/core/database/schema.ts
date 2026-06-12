import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Base timestamp columns for all tables.
 * Usage: ...timestamps
 */
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

export const patientStatusEnum = pgEnum("patient_status", ["waiting", "in-progress", "completed"]);
export const carePlanStatusEnum = pgEnum("care_plan_status", ["active", "completed", "archived"]);
export const userRoleEnum = pgEnum("user_role", ["staff", "nurse"]);

/**
 * Users table for local authentication.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("staff"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  ...timestamps,
});

/**
 * Patients table - core clinical entity.
 * ID format: PT-{YYYYMMDD}-{3-digit-hash}
 */
export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  dob: text("dob").notNull(), // ISO date string or similar
  contact: text("contact").notNull(),
  insurance: text("insurance"),
  email: text("email"), // New column
  appointmentTime: text("appointment_time"), // New column
  symptoms: text("symptoms").notNull(),
  priorityScore: integer("priority_score").notNull().default(0),
  status: patientStatusEnum("status").notNull().default("waiting"),
  ...timestamps,
});

/**
 * Care plans - clinical tracking for patients.
 */
export const carePlans = pgTable("care_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: text("patient_id")
    .notNull()
    .references(() => patients.id, { onDelete: "cascade" }),
  notes: text("notes").notNull(),
  prescriptions: text("prescriptions"),
  followUpDate: text("follow_up_date"),
  caretakerName: text("caretaker_name"),
  attendantName: text("attendant_name"),
  status: carePlanStatusEnum("status").notNull().default("active"),
  ...timestamps,
});

/**
 * Projects table - stores project information with ownership.
 */
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  isPublic: boolean("is_public").notNull().default(false),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ...timestamps,
});
