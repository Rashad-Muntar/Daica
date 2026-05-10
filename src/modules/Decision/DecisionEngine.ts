import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import { Decision } from "./decision.entity";
import { DecisionRules } from "./decisionRules";
import { Claim } from "../claims/claim.entity";
export class DecisionEngine {
  evaluate(claim: Claim, fraud: FraudAnalysis): Decision {
    return DecisionRules.evaluate(claim, fraud);
  }
}
