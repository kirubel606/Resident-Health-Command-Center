import { type NextRequest, NextResponse } from "next/server";
import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { createClient } from "@/core/supabase/server";
import { CreateCarePlanSchema, createCarePlan } from "@/features/care-plans";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const input = CreateCarePlanSchema.parse(body);

    const carePlan = await createCarePlan(input);
    return NextResponse.json(carePlan, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
