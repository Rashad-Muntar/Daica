import axios from "axios";
import { config } from "@/config/app.config";

export class MediaService {
  constructor() {}

  static async uploadWhatsAppImagesToCloudinary(
    mediaUrls: string[],
  ): Promise<string[]> {
    if (!mediaUrls || mediaUrls.length === 0) return [];

    const uploadPromises = mediaUrls.map(async (mediaUrl) => {
      // Step 1: Download each image from WhatsApp
      const response = await axios.get(mediaUrl, {
        headers: {
          Authorization: `Bearer ${config.WaAccessToken}`,
        },
        responseType: "arraybuffer",
      });

      // Step 2: Convert to base64
      const base64 = Buffer.from(response.data).toString("base64");
      const mimeType = response.headers["content-type"];
      const dataUri = `data:${mimeType};base64,${base64}`;

      return dataUri;
    });

    // Run all uploads concurrently
    const urls = await Promise.allSettled(uploadPromises);

    // Filter out any failed uploads and log them
    return urls
      .filter((result) => {
        if (result.status === "rejected") {
          console.error("Image upload failed:", result.reason);
          return false;
        }
        return true;
      })
      .map((result) => (result as PromiseFulfilledResult<string>).value);
  }
}
