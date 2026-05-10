import { WorkflowContext } from "./workflowContext";
import { ClaimService } from "../claims/claim.service";
import { FraudService } from "../fraud/fraud.service";
import { DecisionEngine } from "../decision/DecisionEngine";
import { Claim } from "../claims/claim.entity";
export class Orchestrator {
  constructor(
    private claimService: ClaimService,
    private fraudService: FraudService,
    private decisionEngine: DecisionEngine,
) {}

  async handleClaimSubmission(input: Claim): Promise<WorkflowContext> {
    const claim = await this.claimService.createClaim(input);
    const fraud = await this.fraudService.analyzeClaim(claim);
    const decision = this.decisionEngine.evaluate(claim, fraud);
    const context = new WorkflowContext(claim, fraud, decision);

    return context;
  }
}
