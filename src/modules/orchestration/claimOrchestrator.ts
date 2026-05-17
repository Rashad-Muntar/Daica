import { FraudService } from "../fraud/fraud.service";
import { DecisionEngine } from "../decision/DecisionEngine";

import { Claim } from "../claims/claim.entity";

export class ClaimOrchestrator {
  constructor(
    private fraudService: FraudService,
    private decisionEngine: DecisionEngine,
  ) {}

  async handleClaimSubmission(claim: Claim) {
    // console.log(claim)
    const fraud = await this.fraudService.analyzeClaim(claim);

    const decision = this.decisionEngine.evaluate(claim, fraud);

    return decision
  }
}
