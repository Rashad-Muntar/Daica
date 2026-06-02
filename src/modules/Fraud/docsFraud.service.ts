import { AIService } from "../ai/ai.service";
import type { ClaimRepository } from "../claims/claim.repository";
import type { DocumentCheckResult, DocumentType } from "../ai/ai.types";

import axios from "axios";
import crypto from "crypto";
import { Jimp } from "jimp";

export class DocumentFraudService {
  constructor(
    private aiService: AIService, // ← use service not client
    private claimRepo: ClaimRepository,
  ) {}

  async hashFromUrl(url: string): Promise<string> {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return crypto
      .createHash("sha256")
      .update(Buffer.from(response.data))
      .digest("hex");
  }

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
      police_report: "policeReportPHash",
      repair_invoice: "repairInvoicePHash",
      ghana_card: "ghanaCardPHash",
      doctor_report: "doctorReportPHash",
    };

    const field = fieldMap[docType];
    if (!field) return null;

    const allClaims = await this.claimRepo.findAllPHashes(
      field,
      currentClaimId,
    );

    for (const claim of allClaims) {
      if (!claim.hash) continue;
      const distance = this.hammingDistance(newHash, claim.hash);
      const similarity = ((64 - distance) / 64) * 100;
      if (similarity >= 90) return { claimId: claim.id, similarity };
    }

    return null;
  }

  async checkDocument(
    url: string | undefined,
    docType: DocumentType,
    currentClaimId?: string,
  ): Promise<DocumentCheckResult> {
    const empty: DocumentCheckResult = {
      isReused: false,
      isAuthentic: true,
      confidence: 0,
      tamperedFields: [],
      suspiciousFlags: [],
      missingElements: [],
      similarClaimId: "",
      explanation: "",
    };

    if (!url) return empty;

    // Run hash + pHash + AI validation in parallel
    const [sha256Hash, pHash, validationResult] = await Promise.all([
      this.hashFromUrl(url).catch(() => null),
      this.perceptualHash(url).catch(() => null),
      this.aiService.validateDocument(url, docType), // ← uses AIService
    ]);
    if (!sha256Hash) return empty;

    const [exactMatch, visualMatch] = await Promise.all([
      this.claimRepo.findByDocumentHash(sha256Hash, currentClaimId),
      pHash ? this.findVisualDuplicate(url, docType, currentClaimId) : null,
    ]);

    const matchedClaimId = exactMatch?.id ?? visualMatch?.claimId;

    let isReused = false;
    let tamperedFields: string[] = [];
    let reusedFlags: string[] = [];
    let explanation = "";
    let similarClaimId: string = "";

    if (matchedClaimId) {
      const existingClaim = await this.claimRepo.findById(matchedClaimId);
      const existingUrl = this.getDocUrlFromClaim(existingClaim, docType);

      if (existingUrl) {
        // AI confirms it's actually the same content
        const comparison = await this.aiService.compareDocuments(
          url,
          existingUrl,
          docType,
        );

        if (comparison.isSameContent) {
          isReused = true;
          similarClaimId = matchedClaimId;
          tamperedFields = comparison.tamperedFields;
          reusedFlags = comparison.suspiciousFlags;
          explanation = `Document reused from claim ${matchedClaimId}: ${comparison.explanation}`;
        }
      }
    }

    const result = {
      isReused,
      isAuthentic: validationResult.isAuthentic,
      confidence: validationResult.confidence,
      similarClaimId,
      tamperedFields,
      suspiciousFlags: [...validationResult.suspiciousFlags, ...reusedFlags],
      missingElements: validationResult.missingElements,
      explanation: explanation || validationResult.summary,
    };
    return result;
  }

  private getDocUrlFromClaim(
    claim: any,
    docType: DocumentType,
  ): string | undefined {
    const map: Partial<Record<DocumentType, string>> = {
      police_report: "policeReportUrl",
      repair_invoice: "repairInvoiceUrl",
      ghana_card: "ghanaCardUrl",
      doctor_report: "doctorReportUrl",
      damage_image: "vehicleImages",
    };
    const field = map[docType];
    if (!field) return undefined;
    if (field === "vehicleImages") return claim?.vehicleImages?.[0];
    return claim?.[field];
  }

  async generateHashes(url: string): Promise<{
    sha256: string;
    pHash: string;
  }> {
    const [sha256, pHash] = await Promise.all([
      this.hashFromUrl(url),
      this.perceptualHash(url),
    ]);

    return {
      sha256,
      pHash,
    };
  }

  async generateDocumentHashes(data: {
    vehicleImages?: string[];
    policeReportUrl?: string;
    repairInvoiceUrl?: string;
    doctorReportUrl?: string;
    ghanaCardUrl?: string;
  }) {
    const [
      vehicleResults,
      policeReport,
      repairInvoice,
      doctorReport,
      ghanaCard,
    ] = await Promise.all([
      Promise.all(
        (data.vehicleImages ?? []).map((url) => this.generateHashes(url)),
      ),

      data.policeReportUrl ? this.generateHashes(data.policeReportUrl) : null,

      data.repairInvoiceUrl ? this.generateHashes(data.repairInvoiceUrl) : null,

      data.doctorReportUrl ? this.generateHashes(data.doctorReportUrl) : null,

      data.ghanaCardUrl ? this.generateHashes(data.ghanaCardUrl) : null,
    ]);

    const result = {
      imageHashes: vehicleResults.map((x) => x.sha256),
      imagePHashes: vehicleResults.map((x) => x.pHash),

      policeReportHash: policeReport?.sha256 ?? "",
      policeReportPHash: policeReport?.pHash ?? "",

      repairInvoiceHash: repairInvoice?.sha256 ?? "",
      repairInvoicePHash: repairInvoice?.pHash ?? "",

      doctorReportHash: doctorReport?.sha256 ?? "",
      doctorReportPHash: doctorReport?.pHash ?? "",

      ghanaCardHash: ghanaCard?.sha256 ?? "",
      ghanaCardPHash: ghanaCard?.pHash ?? "",
    };
    return result;
  }
}
