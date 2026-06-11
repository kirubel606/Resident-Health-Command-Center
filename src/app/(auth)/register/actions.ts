"use server";

import { redirect } from "next/navigation";

import { registerUser, createSession } from "@/features/auth/service";

export interface RegisterState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function register(
  _prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const role = (formData.get("role") as "staff" | "nurse") || "staff";

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof confirmPassword !== "string"
  ) {
    return { error: "Invalid form data" };
  }

  if (!email || !password || !confirmPassword) {
    return { error: "All fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const user = await registerUser(email, password, role);
    await createSession(user.id);
  } catch (error) {
    // Log the actual error for developers, but show a friendly message to the user
    console.error("Registration error:", error);
    return { error: "An error occurred during registration. Please check your details and try again." };
  }

  redirect("/dashboard");
}
