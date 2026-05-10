import { ClaimService } from "../claims/claim.service";
import { FraudService } from "../fraud/fraud.service";
import { DecisionEngine } from "../decision/DecisionEngine";
import type { IClaim } from "../claims/claim.type";
import type { FraudAnalysis } from "../fraud/fraudAnalysis.entity";

export class ToolRegistry {
  constructor(
    private claimService: ClaimService,
    private fraudService: FraudService,
    private decisionEngine: DecisionEngine,
  ) {}

  async createClaim(claim: IClaim) {
    return this.claimService.createClaim(claim);
  }

  async analyzeFraud(claim: IClaim) {
    return this.fraudService.analyzeClaim(claim);
  }

  async evaluateDecision(claim: IClaim, fraud: FraudAnalysis) {
    return this.decisionEngine.evaluate(claim, fraud);
  }
}
