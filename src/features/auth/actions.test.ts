import { beforeEach, describe, expect, it, mock } from "bun:test";

// Mock the redirect function
const mockRedirect = mock(() => {
  throw new Error("NEXT_REDIRECT");
});

// Mock Auth Service
const mockVerifyUser = mock(() => Promise.resolve({ id: "user-123", email: "test@example.com" }));
const mockCreateSession = mock(() => Promise.resolve());
const mockRegisterUser = mock(() => Promise.resolve({ id: "user-123", email: "test@example.com" }));
const mockDestroySession = mock(() => Promise.resolve());

// Mock modules
mock.module("next/navigation", () => ({
  redirect: mockRedirect,
}));

mock.module("@/features/auth/service", () => ({
  verifyUser: mockVerifyUser,
  createSession: mockCreateSession,
  registerUser: mockRegisterUser,
  destroySession: mockDestroySession,
}));

// Import after mocking
const { signOut } = await import("./actions");
const { login } = await import("@/app/(auth)/login/actions");
const { register } = await import("@/app/(auth)/register/actions");

describe("signOut", () => {
  beforeEach(() => {
    mockDestroySession.mockClear();
    mockRedirect.mockClear();
  });

  it("calls destroySession and redirects to login", async () => {
    try {
      await signOut();
    } catch {
      // redirect throws
    }

    expect(mockDestroySession).toHaveBeenCalled();
    expect(mockRedirect).toHaveBeenCalledWith("/login");
  });
});

describe("login", () => {
  beforeEach(() => {
    mockVerifyUser.mockClear();
    mockCreateSession.mockClear();
    mockRedirect.mockClear();
    mockVerifyUser.mockImplementation(() => Promise.resolve({ id: "user-123", email: "test@example.com" }) as any);
  });

  it("returns error for invalid form data (missing email)", async () => {
    const formData = new FormData();
    formData.set("password", "password123");

    const result = await login({}, formData);

    expect(result.error).toBe("Invalid form data");
  });

  it("returns error for invalid form data (missing password)", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");

    const result = await login({}, formData);

    expect(result.error).toBe("Invalid form data");
  });

  it("returns error for empty email", async () => {
    const formData = new FormData();
    formData.set("email", "");
    formData.set("password", "password123");

    const result = await login({}, formData);

    expect(result.error).toBe("Email and password are required");
  });

  it("calls verifyUser and createSession with credentials", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");

    try {
      await login({}, formData);
    } catch {
      // redirect throws
    }

    expect(mockVerifyUser).toHaveBeenCalledWith("test@example.com", "password123");
    expect(mockCreateSession).toHaveBeenCalledWith("user-123");
  });

  it("returns error when verifyUser fails", async () => {
    mockVerifyUser.mockImplementationOnce(() => Promise.resolve(null));

    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "wrongpassword");

    const result = await login({}, formData);

    expect(result.error).toBe("Invalid credentials");
  });
});

describe("register", () => {
  beforeEach(() => {
    mockRegisterUser.mockClear();
    mockCreateSession.mockClear();
    mockRedirect.mockClear();
    mockRegisterUser.mockImplementation(() => Promise.resolve({ id: "user-123", email: "test@example.com" }) as any);
  });

  it("returns error for invalid form data (missing email)", async () => {
    const formData = new FormData();
    formData.set("password", "password123");
    formData.set("confirmPassword", "password123");

    const result = await register({}, formData);

    expect(result.error).toBe("Invalid form data");
  });

  it("returns error when passwords do not match", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");
    formData.set("confirmPassword", "different");

    const result = await register({}, formData);

    expect(result.error).toBe("Passwords do not match");
  });

  it("calls registerUser and createSession with credentials", async () => {
    const formData = new FormData();
    formData.set("email", "test@example.com");
    formData.set("password", "password123");
    formData.set("confirmPassword", "password123");
    formData.set("role", "nurse");

    try {
      await register({}, formData);
    } catch {
      // redirect throws
    }

    expect(mockRegisterUser).toHaveBeenCalledWith("test@example.com", "password123", "nurse");
    expect(mockCreateSession).toHaveBeenCalledWith("user-123");
  });

  it("returns error when registerUser fails", async () => {
    mockRegisterUser.mockImplementationOnce(() => Promise.reject(new Error("Email already in use")));

    const formData = new FormData();
    formData.set("email", "existing@example.com");
    formData.set("password", "password123");
    formData.set("confirmPassword", "password123");

    const result = await register({}, formData);

    expect(result.error).toBe("Email already in use");
  });
});
