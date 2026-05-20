export interface EvidenceResult {
  damageDetected: boolean;
  damageArea: "FRONT" | "REAR" | "LEFT" | "RIGHT" | "MULTIPLE" | "UNKNOWN";
  severity: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  imagesAnalyzed: 0;
  visibleIndicators: string[];
  suspiciousFlags: string[];
  summary: string;
}
