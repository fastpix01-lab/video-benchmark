import "server-only";
import type { VideoProvider } from "./types";
import { muxProvider } from "./mux";
import { fastpixProvider } from "./fastpix";
import { apiVideoProvider } from "./apivideo";
import { cloudinaryProvider } from "./cloudinary";
import { gumletProvider } from "./gumlet";
import { vimeoProvider } from "./vimeo";

const providers: Record<string, VideoProvider> = {
  mux: muxProvider,
  fastpix: fastpixProvider,
  apivideo: apiVideoProvider,
  cloudinary: cloudinaryProvider,
  gumlet: gumletProvider,
  vimeo: vimeoProvider,
};

export function getProvider(slug: string): VideoProvider | undefined {
  return providers[slug];
}

export function getAllProviderSlugs(): string[] {
  return Object.keys(providers);
}

export type { VideoProvider, CreateUploadResult, StatusResult, UploadConfig } from "./types";
