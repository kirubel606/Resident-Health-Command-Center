import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/core/api/errors";
import { getPatientCarePlans } from "@/features/care-plans";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const plans = await getPatientCarePlans(id);
    return NextResponse.json(plans);
  } catch (error) {
    return handleApiError(error);
  }
}
