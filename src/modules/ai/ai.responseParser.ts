import type { AIAssessmentResult } from "./ai.types";
import { ClaimUrgency } from "./ai.types";
import { ReviewRecommendation } from "./ai.types";

export class AIResponseParser {
  static parse(raw: string): AIAssessmentResult {
    let parsed: unknown;

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error("AI returned invalid JSON");
    }

    const result = parsed as Partial<AIAssessmentResult>;

    if (!result.summary) {
      throw new Error("Missing summary");
    }

    if (!Array.isArray(result.missingInformation)) {
      throw new Error("Invalid missingInformation");
    }

    if (!Array.isArray(result.contradictions)) {
      throw new Error("Invalid contradictions");
    }

    if (!Object.values(ClaimUrgency).includes(result.urgency!)) {
      throw new Error("Invalid urgency");
    }

    if (!Object.values(ReviewRecommendation).includes(result.recommendation!)) {
      throw new Error("Invalid recommendation");
    }

    if (typeof result.confidence !== "number") {
      throw new Error("Invalid confidence");
    }

    return result as AIAssessmentResult;
  }
}
