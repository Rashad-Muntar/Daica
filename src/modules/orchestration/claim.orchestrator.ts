import { FraudService } from "../fraud/fraud.service";
import { DecisionEngine } from "../decision/DecisionEngine";
import { AIService } from "../ai/ai.service";
import { Claim } from "../claims/claim.entity";

export class ClaimOrchestrator {
  constructor(
    private fraudService: FraudService,
    private decisionEngine: DecisionEngine,
    private aiService: AIService,
  ) {}

  async handleClaimSubmission(claim: Claim) {
    const fraud = await this.fraudService.analyzeClaim(claim);
    const aiResult = await this.aiService.assessClaim(claim, fraud);
    const decision = this.decisionEngine.evaluate(claim, fraud, aiResult);

    return decision;
  }
}
