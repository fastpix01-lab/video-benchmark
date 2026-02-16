declare module "@fastpix/resumable-uploads" {
  interface UploaderOptions {
    endpoint: string;
    file: File;
    chunkSize?: number;
    maxFileSize?: number;
    retryChunkAttempt?: number;
    delayRetry?: number;
  }

  interface UploaderEvent {
    detail: {
      progress?: number;
      message?: string;
    };
  }

  type UploaderEventType =
    | "progress"
    | "success"
    | "error"
    | "attempt"
    | "chunkAttemptFailure"
    | "chunkSuccess"
    | "online"
    | "offline";

  interface UploaderInstance {
    on(event: UploaderEventType, handler: (event: UploaderEvent) => void): void;
    pause(): void;
    resume(): void;
    abort(): void;
  }

  export class Uploader {
    static init(options: UploaderOptions): UploaderInstance;
  }
}
