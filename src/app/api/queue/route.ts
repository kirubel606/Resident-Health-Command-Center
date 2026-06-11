import { NextResponse } from "next/server";
import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { createClient } from "@/core/supabase/server";
import { getQueue } from "@/features/queue";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const queue = await getQueue();
    return NextResponse.json(queue);
  } catch (error) {
    return handleApiError(error);
  }
}
