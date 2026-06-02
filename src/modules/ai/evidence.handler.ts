import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
import { Claim } from "../claims/claim.entity";
import { AIService } from "./ai.service"; // ← from ai module

export class EvidenceHandler {
  constructor(
    private eventBus: EventBus,
    private aiService: AIService,
  ) {}

  register() {
    this.eventBus.subscribe(EventType.CLAIM_SUBMITTED, async (event) => {
      const claim = event.payload as Claim;
      const evidence = await this.aiService.assessDamage(claim.vehicleImages);
      await this.eventBus.publish({
        type: EventType.EVIDENCE_ANALYZED,
        timestamp: new Date(),
        payload: { claim, evidence },
      });
    });
  }
}
