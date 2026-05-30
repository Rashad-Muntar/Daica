import { Jimp } from "jimp";
import axios from "axios";
import type { ClaimRepository } from "@/modules/claims/claim.repository";

export class DocumentFraudService {
  constructor(
    private claimRepo: ClaimRepository, // ← inject, don't instantiate inside methods
  ) {}

  async perceptualHash(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const image = await Jimp.read(Buffer.from(response.data));

    image.resize({ w: 8, h: 8 }).greyscale();

    const pixels: number[] = [];
    image.scan(0, 0, 8, 8, (_x, _y, idx) => {
      pixels.push(image.bitmap.data[idx] as number);
    });

    const avg = pixels.reduce((a, b) => a + b, 0) / pixels.length;
    return pixels.map((p) => (p >= avg ? "1" : "0")).join("");
  }

  hammingDistance(hash1: string, hash2: string): number {
    let diff = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) diff++;
    }
    return diff;
  }

  async findVisualDuplicate(
    url: string,
    docType: string,
    currentClaimId?: string,
  ): Promise<{ claimId: string; similarity: number } | null> {
    const newHash = await this.perceptualHash(url);

    const fieldMap: Record<string, string> = {
      police_report:  "policeReportPHash",
      repair_invoice: "repairInvoicePHash",
      ghana_card:     "ghanaCardPHash",
      doctor_report:  "doctorReportPHash",
    };

    const field = fieldMap[docType];
    if (!field) return null;

    // Returns Array<{ id: string, hash: string }>
    const allClaims = await this.claimRepo.findAllPHashes(field, currentClaimId);

    for (const claim of allClaims) {
      if (!claim.hash) continue; // ← use claim.hash not claim[field]

      const distance = this.hammingDistance(newHash, claim.hash);
      const similarity = ((64 - distance) / 64) * 100;

      if (similarity >= 90) {
        return { claimId: claim.id, similarity }; // ← use claim.id not claim._id
      }
    }

    return null;
  }
}