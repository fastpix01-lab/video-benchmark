import type { VideoProvider } from "./types";

const FASTPIX_API = "https://api.fastpix.io/v1/on-demand";

function authHeader(): string {
  const token = process.env.FASTPIX_ACCESS_TOKEN;
  const secret = process.env.FASTPIX_SECRET_KEY;
  if (!token || !secret) throw new Error("FASTPIX_ACCESS_TOKEN and FASTPIX_SECRET_KEY required");
  return "Basic " + Buffer.from(`${token}:${secret}`).toString("base64");
}

export const fastpixProvider: VideoProvider = {
  slug: "fastpix",
  name: "FastPix",

  async createUpload(corsOrigin) {
    const res = await fetch(`${FASTPIX_API}/upload`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        "X-Client-Type": "web-browser",
      },
      body: JSON.stringify({
        corsOrigin: corsOrigin || "*",
        pushMediaSettings: {
          accessPolicy: "public",
          maxResolution: "1080p",
          mediaQuality: "standard",
        },
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`FastPix upload create failed (${res.status}): ${body}`);
    }
    const json = await res.json();
    const mediaId = json.data.uploadId;
    const signedUrl = json.data.url;

    if (!mediaId) {
      throw new Error(`FastPix upload response missing data.uploadId. Got keys: ${Object.keys(json.data).join(", ")}`);
    }

    return {
      trackingId: mediaId,
      upload: {
        url: signedUrl,
        method: "PUT" as const,
        bodyType: "raw" as const,
        tusProxy: true,
      },
    };
  },

  async checkStatus(trackingId) {
    const statusUrl = `${FASTPIX_API}/${trackingId}`;

    const res = await fetch(statusUrl, {
      headers: {
        Authorization: authHeader(),
        "X-Client-Type": "web-browser",
      },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`FastPix status check failed (${res.status}): ${body}`);
    }
    const json = await res.json();
    const asset = json.data;

    if (asset.status === "Ready" && asset.playbackIds?.length) {
      return {
        ready: true,
        failed: false,
        playbackUrl: `https://stream.fastpix.io/${asset.playbackIds[0].id}.m3u8`,
      };
    }

    return {
      ready: false,
      failed: asset.status === "Failed",
      playbackUrl: null,
      error: asset.status === "Failed"
        ? `FastPix processing failed: ${asset.error || "unknown reason"}`
        : undefined,
    };
  },
};
