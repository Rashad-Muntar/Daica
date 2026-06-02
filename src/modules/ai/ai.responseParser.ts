import type {
  AIAssessmentResult,
  EvidenceResult,
  DocumentValidationResult,
  DocumentDuplicateResult,
} from "./ai.types";
import { ClaimUrgency, ReviewRecommendation } from "./ai.types";

export class AIParser {
  // ─── Claim Assessment ──────────────────────────────────────────────────────
  parseClaimAssessment(raw: string): AIAssessmentResult {
    let json: any;
    try {
      json = JSON.parse(this.extractJson(raw));
    } catch {
      throw new Error("AI returned invalid JSON for claim assessment");
    }

    if (!json.summary) throw new Error("Missing summary");
    if (!Array.isArray(json.missingInformation))
      throw new Error("Invalid missingInformation");
    if (!Array.isArray(json.contradictions))
      throw new Error("Invalid contradictions");
    if (!Object.values(ClaimUrgency).includes(json.urgency))
      throw new Error("Invalid urgency");
    if (!Object.values(ReviewRecommendation).includes(json.recommendation))
      throw new Error("Invalid recommendation");
    if (typeof json.confidence !== "number")
      throw new Error("Invalid confidence");

    return json as AIAssessmentResult;
  }

  // ─── Vehicle Damage ────────────────────────────────────────────────────────
  parseDamageEvidence(raw: string): EvidenceResult {
    let json: any;
    try {
      json = JSON.parse(this.extractJson(raw));
    } catch (err) {
      console.error("DamageEvidenceParser error:", err);
      return this.damageEvidenceFallback();
    }

    return {
      damageDetected: Boolean(json.damageDetected),
      damageArea: this.normalizeEnum(
        json.damageArea,
        ["FRONT", "REAR", "LEFT", "RIGHT", "MULTIPLE", "UNKNOWN"],
        "UNKNOWN",
      ),
      severity: this.normalizeEnum(
        json.severity,
        ["LOW", "MEDIUM", "HIGH"],
        "LOW",
      ),
      confidence: this.normalizeConfidence(json.confidence),
      imagesAnalyzed:
        typeof json.imagesAnalyzed === "number" ? json.imagesAnalyzed : 0,
      visibleIndicators: Array.isArray(json.visibleIndicators)
        ? json.visibleIndicators
        : [],
      suspiciousFlags: Array.isArray(json.suspiciousFlags)
        ? json.suspiciousFlags
        : [],
      summary: typeof json.summary === "string" ? json.summary : "",
    };
  }

  // ─── Document Validation ───────────────────────────────────────────────────
  parseDocumentValidation(raw: string): DocumentValidationResult {
    let json: any;
    try {
      json = JSON.parse(this.extractJson(raw));
    } catch (err) {
      console.error("DocumentValidationParser error:", err);
      return {
        isAuthentic: true,
        confidence: 0,
        missingElements: [],
        suspiciousFlags: [],
        summary: "",
      };
    }

    return {
      isAuthentic:
        typeof json.isAuthentic === "boolean" ? json.isAuthentic : true,
      confidence: this.normalizeConfidence(json.confidence),
      missingElements: Array.isArray(json.missingElements)
        ? json.missingElements
        : [],
      suspiciousFlags: Array.isArray(json.suspiciousFlags)
        ? json.suspiciousFlags
        : [],
      summary: typeof json.summary === "string" ? json.summary : "",
    };
  }

  // ─── Document Duplicate ────────────────────────────────────────────────────
  parseDocumentDuplicate(raw: string): DocumentDuplicateResult {
    let json: any;
    try {
      json = JSON.parse(this.extractJson(raw));
    } catch (err) {
      console.error("DocumentDuplicateParser error:", err);
      return {
        isSameContent: false,
        confidence: 0,
        tamperedFields: [],
        suspiciousFlags: [],
        explanation: "",
      };
    }

    return {
      isSameContent:
        typeof json.isSameContent === "boolean" ? json.isSameContent : false,
      confidence: this.normalizeConfidence(json.confidence),
      tamperedFields: Array.isArray(json.tamperedFields)
        ? json.tamperedFields
        : [],
      suspiciousFlags: Array.isArray(json.suspiciousFlags)
        ? json.suspiciousFlags
        : [],
      explanation: typeof json.explanation === "string" ? json.explanation : "",
    };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  private extractJson(text: string): string {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in model output");
    return match[0];
  }

  private normalizeEnum<T extends string>(
    value: any,
    allowed: T[],
    fallback: T,
  ): T {
    return allowed.includes(value) ? value : fallback;
  }

  private normalizeConfidence(value: any): number {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return Math.min(100, Math.max(0, num));
  }

  private damageEvidenceFallback(): EvidenceResult {
    return {
      damageDetected: false,
      damageArea: "UNKNOWN",
      severity: "LOW",
      confidence: 0,
      imagesAnalyzed: 0,
      visibleIndicators: [],
      suspiciousFlags: ["invalid_model_output"],
      summary: "Unable to analyze evidence due to parsing failure.",
    };
  }
}
