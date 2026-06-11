import { describe, expect, it, mock } from "bun:test";
import { PatientNotFoundError } from "../errors";
import type { NewPatient, Patient } from "../models";
import * as service from "../service";

// Mock the repository
mock.module("../repository", () => ({
  create: mock(async (data: NewPatient) => ({ id: "uuid-123", ...data }) as Patient),
  findById: mock(async (id: string) => {
    if (id === "existing-id") {
      return { id, name: "John Doe", status: "waiting", priorityScore: 5 } as Patient;
    }
    return undefined;
  }),
  update: mock(async (id: string, data: Partial<NewPatient>) => ({ id, ...data }) as Patient),
  findAll: mock(async () => []),
}));

// Mock the triage service
mock.module("../../triage/service", () => ({
  computePriority: mock(async () => 5),
}));

describe("patients service", () => {
  describe("createPatient", () => {
    it("creates a patient with valid input", async () => {
      const input = {
        name: "John Doe",
        dob: "1990-01-01",
        contact: "1234567890",
        symptoms: "Headache",
      };

      const patient = await service.createPatient(input);

      expect(patient.name).toBe(input.name);
      expect(patient.status).toBe("waiting");
      expect(patient.priorityScore).toBe(5);
    });

    it("throws error for invalid DOB format", async () => {
      const input = {
        name: "John Doe",
        dob: "01-01-1990", // Invalid
        contact: "1234567890",
        symptoms: "Headache",
      };

      expect(service.createPatient(input)).rejects.toThrow();
    });
  });

  describe("getPatient", () => {
    it("returns patient if found", async () => {
      const patient = await service.getPatient("existing-id");
      expect(patient.name).toBe("John Doe");
    });

    it("throws PatientNotFoundError if not found", async () => {
      expect(service.getPatient("non-existent")).rejects.toThrow(PatientNotFoundError);
    });
  });
});
