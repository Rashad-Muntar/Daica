import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import { Decision } from "./decision.entity";
import { DecisionRules } from "./decisionRules";
import { Claim } from "../claims/claim.entity";
import type { AIAssessmentResult } from "../ai/ai.types";
export class DecisionEngine {
  evaluate(
    claim: Claim,
    fraud: FraudAnalysis,
    ai: AIAssessmentResult,
  ): Decision {
    return DecisionRules.evaluate(claim, fraud, ai);
  }
}
