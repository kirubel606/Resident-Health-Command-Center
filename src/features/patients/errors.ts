export class PatientError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "PatientError";
  }
}

export class PatientNotFoundError extends PatientError {
  constructor(id: string) {
    super(`Patient not found: ${id}`, "PATIENT_NOT_FOUND", 404);
  }
}

export class PatientAlreadyExistsError extends PatientError {
  constructor(name: string) {
    super(`Patient already exists: ${name}`, "PATIENT_ALREADY_EXISTS", 409);
  }
}
