import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
import { AIService } from "../ai/ai.service";
import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";

export class AIHandler {
  constructor(
    private eventBus: EventBus,
    private aiService: AIService,
  ) {}

  register() {
    this.eventBus.subscribe(EventType.FRAUD_ANALYZED, async (event) => {
        const { claim, claimId, fraud, callbackUrl } = event.payload as {
      claim: Claim; claimId: string; fraud: FraudAnalysis; callbackUrl?: string;
    };
      const ai = await this.aiService.assessClaim(claim, fraud); // ← assessClaim
      await this.eventBus.publish({
        type: EventType.AI_ANALYZED,
        timestamp: new Date(),
        payload:   { claim, claimId, fraud, ai, callbackUrl }
      });
    });
  }
}
