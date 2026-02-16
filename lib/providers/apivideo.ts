import type { VideoProvider } from "./types";

const API_VIDEO_BASE = "https://ws.api.video";

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const apiKey = process.env.APIVIDEO_API_KEY;
  if (!apiKey) throw new Error("APIVIDEO_API_KEY required");

  const res = await fetch(`${API_VIDEO_BASE}/auth/api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`api.video auth failed (${res.status}): ${body}`);
  }
  const json = await res.json();

  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return tokenCache.token;
}

export const apiVideoProvider: VideoProvider = {
  slug: "apivideo",
  name: "api.video",

  async createUpload() {
    const token = await getAccessToken();

    // Create video container — set public:true so HLS URL is accessible without token
    const createRes = await fetch(`${API_VIDEO_BASE}/videos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: `benchmark-${Date.now()}`,
        public: true,
      }),
    });
    if (!createRes.ok) {
      const body = await createRes.text();
      throw new Error(`api.video create failed (${createRes.status}): ${body}`);
    }
    const video = await createRes.json();

    return {
      trackingId: video.videoId,
      upload: {
        url: `${API_VIDEO_BASE}/videos/${video.videoId}/source`,
        method: "POST" as const,
        bodyType: "form-data" as const,
        formField: "file",
        headers: { Authorization: `Bearer ${token}` },
      },
    };
  },

  async checkStatus(trackingId) {
    const token = await getAccessToken();

    const res = await fetch(`${API_VIDEO_BASE}/videos/${trackingId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`api.video status check failed (${res.status})`);
    const data = await res.json();

    // playable:true means at least one HLS quality is encoded
    if (data.encoding?.playable) {
      // Fetch the video object to get the actual HLS playback URL
      const videoRes = await fetch(`${API_VIDEO_BASE}/videos/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!videoRes.ok) throw new Error(`api.video video fetch failed (${videoRes.status})`);
      const video = await videoRes.json();

      return {
        ready: true,
        failed: false,
        playbackUrl: video.assets?.hls || `https://vod.api.video/vod/${trackingId}/hls/manifest.m3u8`,
      };
    }

    const hasFailed = data.encoding?.qualities?.some(
      (q: { status: string }) => q.status === "failed"
    );

    return {
      ready: false,
      failed: !!hasFailed,
      playbackUrl: null,
      error: hasFailed ? "api.video encoding failed" : undefined,
    };
  },
};
