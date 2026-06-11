"use server";

import { redirect } from "next/navigation";

import { verifyUser, createSession } from "@/features/auth/service";

export interface LoginState {
  error?: string;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Invalid form data" };
  }

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const user = await verifyUser(email, password);

    if (!user) {
      return { error: "Invalid credentials" };
    }

    await createSession(user.id);
  } catch (error) {
    return { error: "An authentication error occurred. Please try again later." };
  }

  redirect("/dashboard");
}
