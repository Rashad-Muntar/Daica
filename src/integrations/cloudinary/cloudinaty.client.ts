import { v2 as cloudinary } from "cloudinary";
import { config } from "@/config/app.config";

export class CloudinaryClient {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinaryName,
      api_key: config.cloudinaryKey,
      api_secret: config.cloudinarySecret,
    });
  }

  async upload(filePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "daica/claims",
      resource_type: "image",
    });

    return result.secure_url;
  }
}
