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

    const hasFailed = data.encoding?.qualities?.some(
      (q: { status: string }) => q.status === "failed"
    );
    if (hasFailed) {
      return { ready: false, failed: true, playbackUrl: null, error: "api.video encoding failed" };
    }

    // encoding.playable means at least one quality is done, but the CDN may not
    // have propagated the manifest yet. Probe the URL before declaring ready.
    if (data.encoding?.playable) {
      const videoRes = await fetch(`${API_VIDEO_BASE}/videos/${trackingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!videoRes.ok) throw new Error(`api.video video fetch failed (${videoRes.status})`);
      const video = await videoRes.json();

      const hlsUrl: string =
        video.assets?.hls ||
        `https://vod.api.video/vod/${trackingId}/hls/manifest.m3u8`;

      // Verify the manifest is actually live on the CDN before handing it to HLS.js.
      // If the CDN hasn't propagated yet it returns an HTML error page, which causes
      // HLS.js manifestParsingError. We check for the #EXTM3U header to be sure.
      try {
        const probe = await fetch(hlsUrl, { signal: AbortSignal.timeout(5000) });
        if (probe.ok) {
          const text = await probe.text();
          if (text.trimStart().startsWith("#EXTM3U")) {
            return { ready: true, failed: false, playbackUrl: hlsUrl };
          }
        }
      } catch {
        // Probe failed — CDN not ready yet, keep polling.
      }
    }

    return { ready: false, failed: false, playbackUrl: null };
  },
};
