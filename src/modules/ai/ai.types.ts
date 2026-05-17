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