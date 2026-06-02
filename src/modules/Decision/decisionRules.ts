import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import { Decision, DecisionType } from "./decision.entity";
import { Claim } from "../claims/claim.entity";
import type { AIAssessmentResult } from "../ai/ai.types";

export class DecisionRules {
  static evaluate(
    claim: Claim,
    fraud: FraudAnalysis,
    ai: AIAssessmentResult,
  ): Decision {
    const explainability: string[] = [];

    if (fraud.score >= 75) {
      explainability.push(`High fraud score detected: ${fraud.score}`);

      return {
        type: DecisionType.REJECT,
        reason: "High fraud risk detected",
        analysisResults: {
          fraudReasons: fraud.reasons,
          aiSummary: ai.summary,
          aiMissingInfo: ai.missingInformation,
          aiContradictions: ai.contradictions,
        },
        confidence: 0.9,
        explainability,
      };
    }

    if (ai.contradictions.length > 0) {
      explainability.push("AI detected contradictions in claim details");

      return {
        type: DecisionType.ESCALATE,
        reason: "Conflicting claim information",
        confidence: ai.confidence / 100,
        analysisResults: {
          fraudReasons: fraud.reasons,
          aiSummary: ai.summary,
          aiMissingInfo: ai.missingInformation,
          aiContradictions: ai.contradictions,
        },
        explainability,
      };
    }

    if (ai.missingInformation.length > 2) {
      explainability.push("Multiple required fields missing");

      return {
        type: DecisionType.REQUEST_MORE_INFO,
        reason: "Incomplete claim information",
        analysisResults: {
          fraudReasons: fraud.reasons,
          aiSummary: ai.summary,
          aiMissingInfo: ai.missingInformation,
          aiContradictions: ai.contradictions,
        },
        confidence: 0.6,
        explainability,
      };
    }

    if (ai.urgency === "HIGH" && fraud.score < 40) {
      explainability.push("High urgency but low fraud risk");

      return {
        type: DecisionType.APPROVE,
        reason: "Valid high-priority claim",
        analysisResults: {
          fraudReasons: fraud.reasons,
          aiSummary: ai.summary,
          aiMissingInfo: ai.missingInformation,
          aiContradictions: ai.contradictions,
        },
        confidence: 0.75,
        explainability,
      };
    }

    explainability.push("Default review required due to mixed signals");

    return {
      type: DecisionType.ESCALATE,
      reason: "Requires human review",
      analysisResults: {
        fraudReasons: fraud.reasons,
        aiSummary: ai.summary,
        aiMissingInfo: ai.missingInformation,
        aiContradictions: ai.contradictions,
      },
      confidence: 0.5,
      explainability,
    };
  }
}
