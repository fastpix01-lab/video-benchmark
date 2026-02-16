export const PROVIDERS = [
  { slug: "mux", name: "Mux", proxy: false },
  { slug: "fastpix", name: "FastPix", proxy: false },
  { slug: "apivideo", name: "api.video", proxy: true },
  { slug: "cloudinary", name: "Cloudinary", proxy: false },
  { slug: "gumlet", name: "Gumlet", proxy: true },
] as const;

export const MAX_RETRIES = 2;
export const POLL_INTERVAL = 3000;
export const POLL_TIMEOUT = 5 * 60 * 1000; // 5 min
