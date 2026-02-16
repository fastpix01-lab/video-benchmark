import type { VideoProvider } from "./types";

const VIMEO_API = "https://api.vimeo.com";

function authHeader(): string {
  const token = process.env.VIMEO_ACCESS_TOKEN?.trim();
  if (!token) throw new Error("VIMEO_ACCESS_TOKEN required");
  return `Bearer ${token}`;
}

export const vimeoProvider: VideoProvider = {
  slug: "vimeo",
  name: "Vimeo",

  async createUpload() {
    // Create a video with a tus upload approach.
    // Vimeo's POST /me/videos with upload.approach = "tus" returns
    // an upload.upload_link that accepts a direct PUT from the browser.
    const res = await fetch(`${VIMEO_API}/me/videos`, {
      method: "POST",
      headers: {
        Authorization: authHeader(),
        "Content-Type": "application/json",
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
      body: JSON.stringify({
        upload: { approach: "tus", size: 0 },
        privacy: { view: "anybody" },
        name: `benchmark-${Date.now()}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Vimeo upload create failed (${res.status}): ${body}`);
    }

    const json = await res.json();
    const videoUri = json.uri as string; // e.g. "/videos/123456"
    const videoId = videoUri.split("/").pop()!;
    const uploadLink = json.upload.upload_link as string;

    return {
      trackingId: videoId,
      upload: {
        url: uploadLink,
        method: "PUT" as const,
        bodyType: "raw" as const,
      },
    };
  },

  async checkStatus(trackingId) {
    const res = await fetch(`${VIMEO_API}/videos/${trackingId}`, {
      headers: {
        Authorization: authHeader(),
        Accept: "application/vnd.vimeo.*+json;version=3.4",
      },
    });
    if (!res.ok) {
      throw new Error(`Vimeo status check failed (${res.status})`);
    }
    const data = await res.json();

    // Vimeo transcode status: "complete", "in_progress", "error"
    const transcode = data.transcode?.status;

    if (transcode === "complete") {
      // Build HLS playback URL — Vimeo exposes it via the files endpoint
      // or via the player embed. Use the HLS link from files if available.
      const hlsFile = data.play?.hls?.link;

      if (hlsFile) {
        return { ready: true, failed: false, playbackUrl: hlsFile };
      }

      // Fallback: try the files array for HLS
      const filesRes = await fetch(`${VIMEO_API}/videos/${trackingId}?fields=play`, {
        headers: {
          Authorization: authHeader(),
          Accept: "application/vnd.vimeo.*+json;version=3.4",
        },
      });
      if (filesRes.ok) {
        const filesData = await filesRes.json();
        const hls = filesData.play?.hls?.link;
        if (hls) {
          return { ready: true, failed: false, playbackUrl: hls };
        }
      }

      // If no HLS link yet, treat as not ready (Vimeo may still be generating)
      return { ready: false, failed: false, playbackUrl: null };
    }

    if (transcode === "error") {
      return {
        ready: false,
        failed: true,
        playbackUrl: null,
        error: "Vimeo transcoding failed",
      };
    }

    // Still processing
    return { ready: false, failed: false, playbackUrl: null };
  },
};
