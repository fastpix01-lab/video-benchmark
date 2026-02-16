export interface UploadConfig {
  url: string;
  method: "PUT" | "POST";
  bodyType: "raw" | "form-data";
  headers?: Record<string, string>;
  formField?: string;
  extraFormFields?: Record<string, string>;
  /** If true, client must upload via /api/providers/{slug}/proxy-upload to avoid CORS */
  proxy?: boolean;
  /** If true, use @fastpix/resumable-uploads SDK for chunked upload */
  sdkUpload?: boolean;
}

export interface CreateUploadResult {
  trackingId: string;
  upload: UploadConfig;
}

export interface StatusResult {
  ready: boolean;
  failed: boolean;
  playbackUrl: string | null;
  error?: string;
}

export interface VideoProvider {
  slug: string;
  name: string;
  createUpload(corsOrigin: string): Promise<CreateUploadResult>;
  checkStatus(trackingId: string): Promise<StatusResult>;
}

export interface AdvancedMetrics {
  throttledStartupMs: number;
  networkPreset: string;
  maxBandwidthKbps: number;
  rebufferCount: number;
  rebufferDurationMs: number;
  rebufferRatio: number;
  averageBitrateKbps: number;
  peakBitrateKbps: number;
  smoothnessScore: number;
  levelSwitchCount: number;
  playbackDurationMs: number;
}

export interface ProviderMetrics {
  provider: string;
  providerName: string;
  uploadMs: number;
  processingMs: number;
  startupMs: number;
  totalMs: number;
  playbackUrl: string;
  status: "success" | "failed";
  error?: string;
  advanced?: AdvancedMetrics;
}

export interface BenchmarkRun {
  fileName: string;
  fileSize: number;
  results: ProviderMetrics[];
}
