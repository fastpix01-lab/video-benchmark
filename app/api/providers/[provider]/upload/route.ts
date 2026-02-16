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

    // Prefer the explicit origin sent by the client (reliable on Vercel),
    // then the Origin header, then the Referer-derived origin as last resort.
    let origin = "*";
    try {
      const body = await req.json();
      if (body.origin) origin = body.origin;
    } catch {
      // No JSON body — fall back to headers
    }
    if (origin === "*") {
      origin =
        req.headers.get("origin") ??
        (req.headers.get("referer")
          ? new URL(req.headers.get("referer")!).origin
          : "*");
    }

    const result = await provider.createUpload(origin);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
