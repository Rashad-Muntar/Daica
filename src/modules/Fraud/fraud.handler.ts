import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
import { Claim } from "../claims/claim.entity";
import { FraudService } from "./fraud.service";

export class FraudHandler {
  constructor(
    private eventBus: EventBus,
    private fraudService: FraudService,
  ) {}
  register() {
    this.eventBus.subscribe(EventType.CLAIM_SUBMITTED, async (event) => {
      const claim = event.payload as Claim;
      const fraud = await this.fraudService.analyzeClaim(claim);
      await this.eventBus.publish({
        type: EventType.FRAUD_ANALYZED,
        timestamp: new Date(),
        payload: { claim, fraud },
      });
    });
  }
}
