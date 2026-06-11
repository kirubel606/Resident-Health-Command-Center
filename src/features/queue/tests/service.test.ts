import { describe, expect, it, mock } from "bun:test";
import type { Patient, UpdatePatientInput } from "@/features/patients";
import * as service from "../service";

// Mock the patient service
mock.module("@/features/patients", () => ({
  getAllPatients: mock(async () => [
    { id: "1", name: "P1", status: "waiting", priorityScore: 1 },
    { id: "2", name: "P2", status: "in-progress", priorityScore: 5 },
    { id: "3", name: "P3", status: "completed", priorityScore: 10 },
  ]),
  getPatient: mock(async (id: string) => ({
    id,
    name: `P${id}`,
    status: id === "1" ? "waiting" : "in-progress",
  })),
  updatePatient: mock(async (id: string, data: UpdatePatientInput) => ({ id, ...data }) as Patient),
}));

describe("queue service", () => {
  describe("getQueue", () => {
    it("returns only non-completed patients", async () => {
      const queue = await service.getQueue();
      expect(queue.length).toBe(2);
      expect(queue.every((p) => p.status !== "completed")).toBe(true);
    });
  });

  describe("advancePatient", () => {
    it("advances waiting to in-progress", async () => {
      const updated = await service.advancePatient("1");
      expect(updated.status).toBe("in-progress");
    });

    it("advances in-progress to completed", async () => {
      const updated = await service.advancePatient("2");
      expect(updated.status).toBe("completed");
    });
  });
});
