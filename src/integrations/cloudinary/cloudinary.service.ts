import type { CloudinaryClient } from "./cloudinaty.client";

export class CloudinaryService {
  constructor(private client: CloudinaryClient) {}

  async uploadImages(filePaths: string[]): Promise<string[]> {
    return Promise.all(filePaths.map((f) => this.client.upload(f, "image")));
  }

  async uploadDocuments(filePaths: string[]): Promise<string[]> {
    return Promise.all(filePaths.map((f) => this.client.upload(f, "raw")));
  }
}

export type AllowedMimeType =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
