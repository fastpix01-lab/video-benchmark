import type { VideoProvider } from "./types";

const GUMLET_API = "https://api.gumlet.com/v1/video";

function authHeader(): string {
  const key = process.env.GUMLET_API_KEY;
  if (!key) throw new Error("GUMLET_API_KEY required");
  return `Bearer ${key}`;
}

function getCollectionId(): string {
  const id = process.env.GUMLET_COLLECTION_ID;
  if (!id) throw new Error("GUMLET_COLLECTION_ID required — find it in your Gumlet dashboard under Video > Collections");
  return id;
}

export const gumletProvider: VideoProvider = {
  slug: "gumlet",
  name: "Gumlet",

  async createUpload() {
    const res = await fetch(`${GUMLET_API}/assets/upload`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collection_id: getCollectionId(),
        format: "ABR",
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Gumlet upload create failed (${res.status}): ${body}`);
    }
    const json = await res.json();

    return {
      trackingId: json.asset_id,
      upload: {
        url: json.upload_url,
        method: "PUT" as const,
        bodyType: "raw" as const,
      },
    };
  },

  async checkStatus(trackingId) {
    const res = await fetch(`${GUMLET_API}/assets/${trackingId}`, {
      headers: { Authorization: authHeader() },
    });
    if (!res.ok) throw new Error(`Gumlet status check failed (${res.status})`);
    const data = await res.json();

    if (data.status === "ready") {
      const playbackUrl =
        data.output?.playback_url ||
        data.output?.hls_url ||
        null;

      if (!playbackUrl) {
        return { ready: false, failed: true, playbackUrl: null, error: "Gumlet: no playback URL in ready response" };
      }
      return { ready: true, failed: false, playbackUrl };
    }

    if (data.status === "errored" || data.status === "failed") {
      return {
        ready: false,
        failed: true,
        playbackUrl: null,
        error: `Gumlet processing failed (${data.status})`,
      };
    }

    return { ready: false, failed: false, playbackUrl: null };
  },
};
