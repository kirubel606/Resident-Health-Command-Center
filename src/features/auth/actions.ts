"use server";

import { redirect } from "next/navigation";

import { getLogger } from "@/core/logging";
import { destroySession } from "@/features/auth/service";

const logger = getLogger("auth.actions");

/**
 * Sign out the current user and redirect to login.
 */
export async function signOut(): Promise<void> {
  await destroySession();

  logger.info("auth.signout_completed");
  redirect("/login");
}
