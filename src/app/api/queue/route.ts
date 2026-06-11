import { NextResponse } from "next/server";
import { handleApiError } from "@/core/api/errors";
import { getQueue } from "@/features/queue";

export async function GET() {
  try {
    const queue = await getQueue();
    return NextResponse.json(queue);
  } catch (error) {
    return handleApiError(error);
  }
}
