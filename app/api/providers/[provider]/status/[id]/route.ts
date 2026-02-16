import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ provider: string; id: string }> }
) {
  try {
    const { provider: slug, id } = await params;
    const provider = getProvider(slug);
    if (!provider) {
      return NextResponse.json({ error: `Unknown provider: ${slug}` }, { status: 404 });
    }

    const result = await provider.checkStatus(id);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
