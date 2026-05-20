import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
import { Claim } from "../claims/claim.entity";
import { EvidenceService } from "./evidence.service";

export class EvidenceHandler {
  constructor(
    private eventBus: EventBus,
    private evidenceService: EvidenceService,
  ) {}

  register() {
    this.eventBus.subscribe(EventType.CLAIM_SUBMITTED, async (event) => {
      const claim = event.payload as Claim;

      const evidence = await this.evidenceService.assessEvidence(claim.images);

      await this.eventBus.publish({
        type: EventType.EVIDENCE_ANALYZED,
        timestamp: new Date(),
        payload: {
          claim,
          evidence,
        },
      });
    });
  }
}
