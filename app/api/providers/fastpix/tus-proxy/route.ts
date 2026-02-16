import { NextRequest, NextResponse } from "next/server";

/**
 * Tus proxy for FastPix uploads.
 *
 * The browser cannot send requests directly to FastPix's tus upload URL
 * due to CORS restrictions. This route receives chunks from the browser
 * (each < 4 MB to stay under Vercel's 4.5 MB body limit) and forwards
 * them as tus PATCH requests to FastPix's server.
 */

export async function PATCH(req: NextRequest) {
  try {
    const uploadUrl = req.headers.get("x-upload-url");
    const uploadOffset = req.headers.get("upload-offset");

    if (!uploadUrl || uploadOffset === null) {
      return NextResponse.json(
        { error: "Missing x-upload-url or upload-offset header" },
        { status: 400 }
      );
    }

    const chunk = Buffer.from(await req.arrayBuffer());

    const res = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        "Tus-Resumable": "1.0.0",
        "Upload-Offset": uploadOffset,
        "Content-Type": "application/offset+octet-stream",
        "Content-Length": chunk.length.toString(),
      },
      body: chunk,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `FastPix tus PATCH failed (${res.status}): ${body}` },
        { status: res.status }
      );
    }

    const newOffset = res.headers.get("Upload-Offset") || "";

    return NextResponse.json({ offset: newOffset });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tus proxy error";
    console.error(`[tus-proxy] ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * HEAD proxy — tus clients use HEAD to check current upload offset.
 */
export async function HEAD(req: NextRequest) {
  try {
    const uploadUrl = req.headers.get("x-upload-url");
    if (!uploadUrl) {
      return new Response(null, { status: 400 });
    }

    const res = await fetch(uploadUrl, {
      method: "HEAD",
      headers: { "Tus-Resumable": "1.0.0" },
    });

    return new Response(null, {
      status: res.status,
      headers: {
        "Upload-Offset": res.headers.get("Upload-Offset") || "0",
        "Upload-Length": res.headers.get("Upload-Length") || "",
        "Tus-Resumable": "1.0.0",
      },
    });
  } catch {
    return new Response(null, { status: 500 });
  }
}

/**
 * POST proxy — tus creation step (if needed to initialize offset).
 */
export async function POST(req: NextRequest) {
  try {
    const uploadUrl = req.headers.get("x-upload-url");
    const uploadLength = req.headers.get("upload-length");

    if (!uploadUrl || !uploadLength) {
      return NextResponse.json(
        { error: "Missing x-upload-url or upload-length header" },
        { status: 400 }
      );
    }

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Tus-Resumable": "1.0.0",
        "Upload-Length": uploadLength,
        "Content-Type": "application/offset+octet-stream",
        "Content-Length": "0",
      },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `FastPix tus POST failed (${res.status}): ${body}` },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tus proxy error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
