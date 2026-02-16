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

    // Parse the uploaded file from multipart form data
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Step 1: Create upload with the provider (get signed URL + trackingId)
    const origin = req.headers.get("origin") ?? "*";
    const { trackingId, upload } = await provider.createUpload(origin);

    // Step 2: Forward the file to the provider's upload URL
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    if (upload.bodyType === "raw") {
      const headers: Record<string, string> = {
        "Content-Type": file.type || "video/mp4",
      };
      if (upload.headers) {
        Object.assign(headers, upload.headers);
      }
      const res = await fetch(upload.url, {
        method: upload.method,
        body: fileBuffer,
        headers,
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Provider upload failed (${res.status}): ${body}`);
      }
    } else {
      // form-data upload (e.g. api.video)
      const proxyForm = new FormData();
      proxyForm.append(upload.formField || "file", new Blob([fileBuffer], { type: file.type || "video/mp4" }), file.name);
      if (upload.extraFormFields) {
        for (const [k, v] of Object.entries(upload.extraFormFields)) {
          proxyForm.append(k, v);
        }
      }
      // Build headers without Content-Type (let fetch set multipart boundary)
      const headers: Record<string, string> = {};
      if (upload.headers) {
        for (const [k, v] of Object.entries(upload.headers)) {
          if (k.toLowerCase() !== "content-type") headers[k] = v;
        }
      }
      const res = await fetch(upload.url, {
        method: upload.method,
        body: proxyForm,
        headers,
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`Provider upload failed (${res.status}): ${body}`);
      }
    }

    return NextResponse.json({ trackingId });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Proxy upload failed";
    console.error(`[proxy-upload] ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
