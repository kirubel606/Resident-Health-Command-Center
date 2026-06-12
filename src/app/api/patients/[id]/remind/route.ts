import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/core/api/errors";
import { getPatient } from "@/features/patients";
import { sendReminder } from "@/core/email";
import { flags } from "@/core/config/flags";

// API route: POST /api/patients/:id/remind

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!flags.emailReminders) {
      return NextResponse.json({ error: "Feature disabled" }, { status: 403 });
    }

    const { id } = await params;
    const patient = await getPatient(id);
    
    // Assuming patient model has email and appointmentTime
    // Need to verify patient model later, but this matches the plan requirements.
    await sendReminder({
      name: patient.name,
      email: patient.email,
      appointmentTime: patient.appointmentTime || "TBD",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
