import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../Fraud/fraudAnalysis.entity";
import { Decision, DecisionType } from "./decision.entity";

export class DecisionRules {
  static evaluate(claim: Claim, fraud: FraudAnalysis): Decision {
    if (!claim.isComplete()) {
      return new Decision(
        DecisionType.REQUEST_MORE_INFO,
        "Claim information is incomplete",
      );
    }

    if (fraud.isHighRisk()) {
      return new Decision(DecisionType.ESCALATE, "High fraud risk detected");
    }

    return new Decision(DecisionType.APPROVE, "Claim passed automated checks");
  }
}
