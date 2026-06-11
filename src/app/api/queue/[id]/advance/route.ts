import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/core/api/errors";
import { advancePatient } from "@/features/queue";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const patient = await advancePatient(id);
    return NextResponse.json(patient);
  } catch (error) {
    return handleApiError(error);
  }
}
