import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../Fraud/fraudAnalysis.entity";
import { Decision } from "./decision.entity";
import { DecisionRules } from "./decisionRules";

export class DecisionEngine {
  evaluate(claim: Claim, fraud: FraudAnalysis): Decision {
    return DecisionRules.evaluate(claim, fraud);
  }
}
