import type { EvidenceResult } from "./evidence.types";
export class EvidenceParser {
  parse(raw: string): EvidenceResult {
    let json: any;

    try {
      // 1. Extract JSON block if model adds extra text
      const cleaned = this.extractJson(raw);

      json = JSON.parse(cleaned);
    } catch (err) {
      console.log(err);
      this.fallback();
    }

    return this.normalize(json);
  }

  private extractJson(text: string): string {
    // handles cases like ```json {...} ```
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No JSON found in model output");
    }

    return match[0];
  }

  private normalize(data: any): EvidenceResult {
    return {
      damageDetected: Boolean(data.damageDetected),

      damageArea: this.normalizeEnum(
        data.damageArea,
        ["FRONT", "REAR", "LEFT", "RIGHT", "MULTIPLE", "UNKNOWN"],
        "UNKNOWN",
      ),

      severity: this.normalizeEnum(
        data.severity,
        ["LOW", "MEDIUM", "HIGH"],
        "LOW",
      ),

      confidence: this.normalizeConfidence(data.confidence),

      visibleIndicators: Array.isArray(data.visibleIndicators)
        ? data.visibleIndicators
        : [],

      suspiciousFlags: Array.isArray(data.suspiciousFlags)
        ? data.suspiciousFlags
        : [],
      imagesAnalyzed: data.imagesAnalyzedd,
      summary: typeof data.summary === "string" ? data.summary : "",
    };
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

  private fallback(): EvidenceResult {
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
