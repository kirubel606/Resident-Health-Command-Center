import { type NextRequest, NextResponse } from "next/server";
import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { createClient } from "@/core/supabase/server";
import { advancePatient } from "@/features/queue";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const patient = await advancePatient(id);
    return NextResponse.json(patient);
  } catch (error) {
    return handleApiError(error);
  }
}
