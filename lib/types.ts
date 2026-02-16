export interface UploadMetrics {
  uploadDurationMs: number;
  processingDurationMs: number;
  startupTimeMs: number;
}

export interface MuxUploadResponse {
  uploadUrl: string;
  uploadId: string;
}

export interface MuxStatusResponse {
  uploadStatus: string;
  assetId: string | null;
  assetStatus: string | null;
  playbackId: string | null;
}
