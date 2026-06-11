import { NextResponse } from "next/server";
import { getSessionUser } from "@/features/auth/service";

export async function GET() {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    // Don't return the password hash!
    const { passwordHash, ...safeUser } = user;
    
    return NextResponse.json({ user: safeUser });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
