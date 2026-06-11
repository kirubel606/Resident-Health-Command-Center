import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/core/api/errors";
import { CreateCarePlanSchema, createCarePlan } from "@/features/care-plans";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = CreateCarePlanSchema.parse(body);

    const carePlan = await createCarePlan(input);
    return NextResponse.json(carePlan, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
