import { WorkflowContext } from "./workflowContext";
import { FraudService } from "../fraud/fraud.service";
import { DecisionEngine } from "../decision/DecisionEngine";

import { Claim } from "../claims/claim.entity";

export class ClaimOrchestrator {
  constructor(
    private fraudService: FraudService,
    private decisionEngine: DecisionEngine,
  ) {}

  async handleClaimSubmission(claim: Claim): Promise<WorkflowContext> {
    const fraud = await this.fraudService.analyzeClaim(claim);

    const decision = this.decisionEngine.evaluate(claim, fraud);

    return new WorkflowContext(claim, fraud, decision);
  }
}
