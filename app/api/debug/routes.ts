import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    runtime: process.env.NEXT_RUNTIME || "node",
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "❌ MISSING",
    supabaseKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "...",
  });
}
