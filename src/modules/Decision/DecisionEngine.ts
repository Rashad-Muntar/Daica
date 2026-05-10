import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import { Decision } from "./decision.entity";
import { DecisionRules } from "./decisionRules";
import type { IClaim } from "../claims/claim.type";

export class DecisionEngine {
  evaluate(claim: IClaim, fraud: FraudAnalysis): Decision {
    return DecisionRules.evaluate(claim, fraud);
  }
}
