import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { renderHook, waitFor } from "@testing-library/react";

// Mock user data
const mockUser = {
  id: "user-123",
  email: "test@example.com",
  role: "staff",
};

// Mock fetch
const mockFetch = mock(() =>
  Promise.resolve({
    json: () => Promise.resolve({ user: mockUser }),
  })
);
global.fetch = mockFetch as any;

// Import after mocking
const { useUser } = await import("./hooks");

describe("useUser", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: mockUser }),
      }) as any
    );
  });

  it("returns loading state initially", () => {
    const { result } = renderHook(() => useUser());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("returns user after loading", async () => {
    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith("/api/auth/me");
  });

  it("returns undefined user when not authenticated", async () => {
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: null }),
      }) as any
    );

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("handles fetch error gracefully", async () => {
    mockFetch.mockImplementationOnce(() => Promise.reject(new Error("Network error")));

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
