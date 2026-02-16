import { NextRequest, NextResponse } from "next/server";
import { getUploadStatus, getAssetStatus } from "@/lib/mux";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const { uploadId } = await params;
    const upload = await getUploadStatus(uploadId);

    let assetStatus: string | null = null;
    let playbackId: string | null = null;
    let assetId: string | null = upload.asset_id ?? null;

    if (assetId) {
      const asset = await getAssetStatus(assetId);
      assetStatus = asset.status;
      playbackId = asset.playbackId;
    }

    return NextResponse.json({
      uploadStatus: upload.status,
      assetId,
      assetStatus,
      playbackId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Status check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
