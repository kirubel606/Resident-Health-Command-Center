import { type NextRequest, NextResponse } from "next/server";
import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { createClient } from "@/core/supabase/server";
import { getPatientCarePlans } from "@/features/care-plans";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const plans = await getPatientCarePlans(id);
    return NextResponse.json(plans);
  } catch (error) {
    return handleApiError(error);
  }
}
