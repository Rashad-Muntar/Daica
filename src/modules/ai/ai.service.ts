import { AIClient } from "./ai.client";
import { AIParser } from "./ai.responseParser";

import {
  ClaimAssessmentPromptBuilder,
  DamageEvidencePromptBuilder,
  DocumentPromptBuilder,
} from "./ai.promptBuilder";
import type {
  AIAssessmentResult,
  EvidenceResult,
  DocumentValidationResult,
  DocumentDuplicateResult,
  DocumentType,
} from "./ai.types";
import type { Claim } from "../claims/claim.entity";
import type { FraudAnalysis } from "../fraud/fraudAnalysis.entity";

export class AIService {
  private parser = new AIParser();

  constructor(private client: AIClient) {}

  // ─── Claim Assessment (text) ───────────────────────────────────────────────
  async assessClaim(
    claim: Claim,
    fraud: FraudAnalysis,
  ): Promise<AIAssessmentResult> {
    const prompt = ClaimAssessmentPromptBuilder.build(claim, fraud);
    const raw = await this.client.generate(prompt);
    const parsed = this.parser.parseClaimAssessment(raw);
    return parsed;
  }

  // ─── Vehicle Damage (vision) ───────────────────────────────────────────────
  async assessDamage(images: string[]): Promise<EvidenceResult> {
    const prompt = DamageEvidencePromptBuilder.buildDamageCheck(images.length);
    const raw = await this.client.generateWithImages(prompt, images);
    return this.parser.parseDamageEvidence(raw);
  }

  // ─── Document Validation (vision) ─────────────────────────────────────────
  async validateDocument(
    url: string,
    docType: DocumentType,
  ): Promise<DocumentValidationResult> {
    const promptMap: Partial<Record<DocumentType, () => string>> = {
      police_report: DocumentPromptBuilder.buildPoliceReportValidation,
      repair_invoice: DocumentPromptBuilder.buildRepairInvoiceValidation,
      ghana_card: DocumentPromptBuilder.buildGhanaCardValidation,
      doctor_report: DocumentPromptBuilder.buildDoctorReportValidation,
    };
    // console.log("AI IS TRIGGERED WITH:", url, docType)
    const buildPrompt = promptMap[docType];
    // console.log("Building prompt for document type:", docType, buildPrompt);
    if (!buildPrompt) {
      return {
        isAuthentic: true,
        confidence: 0,
        missingElements: [],
        suspiciousFlags: [],
        summary: "",
      };
    }

    const raw = await this.client.generateWithImages(buildPrompt(), [url]);
    return this.parser.parseDocumentValidation(raw);
  }

  // ─── Document Duplicate Check (vision) ────────────────────────────────────
  async compareDocuments(
    url1: string,
    url2: string,
    docType: DocumentType,
  ): Promise<DocumentDuplicateResult> {
    const prompt = DocumentPromptBuilder.buildDuplicateCheck(
      docType.replace("_", " "),
    );
    const raw = await this.client.generateWithImages(prompt, [url1, url2]);
    // console.log("Raw duplicate check response:", raw);
    return this.parser.parseDocumentDuplicate(raw);
  }
}
