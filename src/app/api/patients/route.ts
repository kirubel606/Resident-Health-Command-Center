import { type NextRequest, NextResponse } from "next/server";
import { handleApiError, unauthorizedResponse } from "@/core/api/errors";
import { createClient } from "@/core/supabase/server";
import { CreatePatientSchema, createPatient, getAllPatients } from "@/features/patients";

// API route for patient management

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return unauthorizedResponse();
    }

    const patients = await getAllPatients();
    return NextResponse.json(patients);
  } catch (error) {
    return handleApiError(error);
  }
}

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
    const input = CreatePatientSchema.parse(body);

    const patient = await createPatient(input);
    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
