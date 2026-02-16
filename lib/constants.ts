export const PROVIDERS = [
  { slug: "mux", name: "Mux", proxy: false },
  { slug: "fastpix", name: "FastPix", proxy: false },
  { slug: "apivideo", name: "api.video", proxy: false },
  { slug: "cloudinary", name: "Cloudinary", proxy: false },
  { slug: "gumlet", name: "Gumlet", proxy: false },
  { slug: "vimeo", name: "Vimeo", proxy: false },
] as const;

export const DEFAULT_ENABLED = ["mux", "fastpix", "apivideo"];

export const MAX_RETRIES = 2;
export const POLL_INTERVAL = 3000;
export const POLL_TIMEOUT = 5 * 60 * 1000; // 5 min

export const NETWORK_PRESETS = {
  "3g": { label: "3G (750 Kbps)", maxBandwidthKbps: 750 },
  "2g": { label: "2G (150 Kbps)", maxBandwidthKbps: 150 },
} as const;

export const ADVANCED_PLAYBACK_DURATION = 10_000; // 10 seconds of observation
