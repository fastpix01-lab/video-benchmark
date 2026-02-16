import type { VideoProvider } from "./types";

const MUX_API = "https://api.mux.com/video/v1";

function authHeader(): string {
  const id = process.env.MUX_TOKEN_ID;
  const secret = process.env.MUX_TOKEN_SECRET;
  if (!id || !secret) throw new Error("MUX_TOKEN_ID and MUX_TOKEN_SECRET required");
  return "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
}

export const muxProvider: VideoProvider = {
  slug: "mux",
  name: "Mux",

  async createUpload(corsOrigin) {
    const res = await fetch(`${MUX_API}/uploads`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        new_asset_settings: { playback_policy: ["public"] },
        cors_origin: corsOrigin || "*",
      }),
    });
    if (!res.ok) throw new Error(`Mux upload create failed (${res.status})`);
    const json = await res.json();
    return {
      trackingId: json.data.id,
      upload: {
        url: json.data.url,
        method: "PUT" as const,
        bodyType: "raw" as const,
      },
    };
  },

  async checkStatus(trackingId) {
    const uploadRes = await fetch(`${MUX_API}/uploads/${trackingId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!uploadRes.ok) throw new Error(`Mux status check failed (${uploadRes.status})`);
    const upload = (await uploadRes.json()).data;
    const assetId = upload.asset_id;

    if (!assetId) {
      return { ready: false, failed: upload.status === "errored", playbackUrl: null };
    }

    const assetRes = await fetch(`${MUX_API}/assets/${assetId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!assetRes.ok) throw new Error(`Mux asset check failed (${assetRes.status})`);
    const asset = (await assetRes.json()).data;

    if (asset.status === "ready" && asset.playback_ids?.length) {
      return {
        ready: true,
        failed: false,
        playbackUrl: `https://stream.mux.com/${asset.playback_ids[0].id}.m3u8`,
      };
    }

    return {
      ready: false,
      failed: asset.status === "errored",
      playbackUrl: null,
      error: asset.status === "errored" ? "Mux asset processing failed" : undefined,
    };
  },
};
