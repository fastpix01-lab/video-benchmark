import { NextRequest, NextResponse } from "next/server";
import { createDirectUpload } from "@/lib/mux";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin") ?? "*";
    const { uploadUrl, uploadId } = await createDirectUpload(origin);
    return NextResponse.json({ uploadUrl, uploadId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
