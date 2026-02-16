import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider: slug } = await params;
    const provider = getProvider(slug);
    if (!provider) {
      return NextResponse.json({ error: `Unknown provider: ${slug}` }, { status: 404 });
    }

    const origin = req.headers.get("origin") ?? "*";
    const result = await provider.createUpload(origin);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
