import { db } from "@/core/database/client";
import { users, patients } from "@/core/database/schema";
import { hashPassword } from "@/features/auth/service";

async function seed() {
  console.log("Seeding database (skipping existing records)...");

  // 1. Seed dummy users
  const staffHash = hashPassword("password123");
  await db.insert(users)
    .values([
      { email: "staff@clinic.com", passwordHash: staffHash, role: "staff", displayName: "Front Desk" },
      { email: "nurse@clinic.com", passwordHash: staffHash, role: "nurse", displayName: "Head Nurse" },
    ])
    .onConflictDoNothing();

  // 2. Seed 12 dummy patients
  const dummyPatients = [
    { id: "PT-20260611-001", name: "John Doe", dob: "1980-05-15", contact: "555-0101", insurance: "HealthCorp", symptoms: "Fever, cough", priorityScore: 7, status: "waiting" },
    { id: "PT-20260611-002", name: "Jane Smith", dob: "1992-10-22", contact: "555-0202", insurance: "SafeLife", symptoms: "Minor laceration", priorityScore: 3, status: "waiting" },
    { id: "PT-20260611-003", name: "Alice Johnson", dob: "1975-01-10", contact: "555-0303", insurance: "MediCare", symptoms: "Chest pain", priorityScore: 9, status: "waiting" },
    { id: "PT-20260611-004", name: "Bob Brown", dob: "1995-03-12", contact: "555-0404", insurance: "GlobalHealth", symptoms: "Broken arm", priorityScore: 8, status: "in-progress" },
    { id: "PT-20260611-005", name: "Charlie Davis", dob: "2000-07-30", contact: "555-0505", insurance: "HealthCorp", symptoms: "Sore throat", priorityScore: 2, status: "waiting" },
    { id: "PT-20260611-006", name: "Diana Evans", dob: "1988-12-05", contact: "555-0606", insurance: "SafeLife", symptoms: "Migraine", priorityScore: 4, status: "in-progress" },
    { id: "PT-20260611-007", name: "Evan Foster", dob: "1960-09-18", contact: "555-0707", insurance: "MediCare", symptoms: "Shortness of breath", priorityScore: 10, status: "waiting" },
    { id: "PT-20260611-008", name: "Fiona Green", dob: "1998-02-14", contact: "555-0808", insurance: "GlobalHealth", symptoms: "Rash", priorityScore: 1, status: "waiting" },
    { id: "PT-20260611-009", name: "George Harris", dob: "1955-11-20", contact: "555-0909", insurance: "HealthCorp", symptoms: "Dizziness", priorityScore: 6, status: "waiting" },
    { id: "PT-20260611-010", name: "Hannah Iverson", dob: "2010-06-25", contact: "555-1010", insurance: "SafeLife", symptoms: "Ear ache", priorityScore: 3, status: "waiting" },
    { id: "PT-20260611-011", name: "Ian Jenson", dob: "1985-04-04", contact: "555-1111", insurance: "MediCare", symptoms: "Flu symptoms", priorityScore: 5, status: "in-progress" },
    { id: "PT-20260611-012", name: "Julia King", dob: "1990-08-15", contact: "555-1212", insurance: "GlobalHealth", symptoms: "Allergic reaction", priorityScore: 9, status: "waiting" },
  ];

  await db.insert(patients)
    .values(dummyPatients)
    .onConflictDoNothing();

  console.log("Seeding complete!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
