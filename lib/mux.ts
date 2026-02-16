import "server-only";

const MUX_API_BASE = "https://api.mux.com/video/v1";

function getAuthHeader(): string {
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET must be set");
  }
  return "Basic " + Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64");
}

export async function createDirectUpload(corsOrigin: string) {
  const res = await fetch(`${MUX_API_BASE}/uploads`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      new_asset_settings: { playback_policy: ["public"] },
      cors_origin: corsOrigin,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mux create upload failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  return {
    uploadUrl: json.data.url as string,
    uploadId: json.data.id as string,
  };
}

export async function getUploadStatus(uploadId: string) {
  const res = await fetch(`${MUX_API_BASE}/uploads/${uploadId}`, {
    headers: { Authorization: getAuthHeader() },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mux get upload failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  return json.data as {
    id: string;
    status: string;
    asset_id?: string;
  };
}

export async function getAssetStatus(assetId: string) {
  const res = await fetch(`${MUX_API_BASE}/assets/${assetId}`, {
    headers: { Authorization: getAuthHeader() },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mux get asset failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  const asset = json.data as {
    id: string;
    status: string;
    playback_ids?: { id: string; policy: string }[];
  };

  return {
    assetId: asset.id,
    status: asset.status,
    playbackId: asset.playback_ids?.[0]?.id ?? null,
  };
}
