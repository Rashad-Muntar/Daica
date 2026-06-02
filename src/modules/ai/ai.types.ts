// ─── Claim Assessment ────────────────────────────────────────────────────────
export enum ClaimUrgency {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum ReviewRecommendation {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  ESCALATE = "ESCALATE",
  REQUEST_MORE_INFO = "REQUEST_MORE_INFO",
}

export interface AIAssessmentResult {
  summary: string;
  missingInformation: string[];
  contradictions: string[];
  urgency: ClaimUrgency;
  recommendation: ReviewRecommendation;
  confidence: number;
}

// ─── Vehicle Damage Evidence ─────────────────────────────────────────────────
export interface EvidenceResult {
  damageDetected: boolean;
  damageArea: "FRONT" | "REAR" | "LEFT" | "RIGHT" | "MULTIPLE" | "UNKNOWN";
  severity: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  imagesAnalyzed: number;
  visibleIndicators: string[];
  suspiciousFlags: string[];
  summary: string;
}

// ─── Document Verification ───────────────────────────────────────────────────
export interface DocumentValidationResult {
  isAuthentic: boolean;
  confidence: number;
  missingElements: string[];
  suspiciousFlags: string[];
  summary: string;
}

export interface DocumentDuplicateResult {
  isSameContent: boolean;
  confidence: number;
  tamperedFields: string[];
  suspiciousFlags: string[];
  explanation: string;
}

export interface DocumentCheckResult {
  isReused: boolean;
  isAuthentic: boolean;
  confidence: number;
  similarClaimId?: string;
  tamperedFields: string[];
  suspiciousFlags: string[];
  missingElements: string[];
  explanation: string;
}

export type DocumentType =
  | "police_report"
  | "repair_invoice"
  | "ghana_card"
  | "doctor_report"
  | "damage_image";
