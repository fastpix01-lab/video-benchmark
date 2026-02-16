import crypto from "crypto";
import type { VideoProvider } from "./types";

function getConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET required");
  }
  return { cloudName, apiKey, apiSecret };
}

function sign(params: Record<string, string>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha1").update(sorted + apiSecret).digest("hex");
}

export const cloudinaryProvider: VideoProvider = {
  slug: "cloudinary",
  name: "Cloudinary",

  async createUpload() {
    const { cloudName, apiKey, apiSecret } = getConfig();
    const publicId = `benchmark_${Date.now()}`;
    const timestamp = Math.floor(Date.now() / 1000).toString();

    const paramsToSign: Record<string, string> = {
      eager: "sp_auto",
      eager_async: "true",
      public_id: publicId,
      timestamp,
    };

    const signature = sign(paramsToSign, apiSecret);

    return {
      trackingId: publicId,
      upload: {
        url: `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
        method: "POST" as const,
        bodyType: "form-data" as const,
        formField: "file",
        extraFormFields: {
          api_key: apiKey,
          timestamp,
          signature,
          public_id: publicId,
          eager: "sp_auto",
          eager_async: "true",
        },
      },
    };
  },

  async checkStatus(trackingId) {
    const { cloudName } = getConfig();
    const hlsUrl = `https://res.cloudinary.com/${cloudName}/video/upload/sp_auto/${trackingId}.m3u8`;

    try {
      const res = await fetch(hlsUrl, { method: "HEAD" });
      if (res.ok) {
        return { ready: true, failed: false, playbackUrl: hlsUrl };
      }
      // 423 = still processing, 404 = not found yet
      if (res.status === 404 || res.status === 423) {
        return { ready: false, failed: false, playbackUrl: null };
      }
      // Other errors (e.g. 400 = Video add-on required)
      return {
        ready: false,
        failed: true,
        playbackUrl: null,
        error: `Cloudinary HLS returned ${res.status} — Video add-on may be required`,
      };
    } catch {
      return { ready: false, failed: false, playbackUrl: null };
    }
  },
};
