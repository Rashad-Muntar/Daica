import { CloudinaryClient } from "./cloudinaty.client";

export class CloudinaryService {
  constructor(
    private client: CloudinaryClient,
  ) {}

  async uploadImages(
    filePaths: string[],
  ): Promise<string[]> {
    return Promise.all(
      filePaths.map((file) =>
        this.client.upload(file),
      ),
    );
  }
}