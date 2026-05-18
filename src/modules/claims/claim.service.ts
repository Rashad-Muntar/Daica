import { Claim } from "./claim.entity";
import { ClaimRepository } from "./claim.repository";
import { UnprocessableEntityError } from "@/utils/errors";
import type { IClaim } from "./claim.type";
import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
export class ClaimService {
  constructor(
    private repo: ClaimRepository,
    private eventBus: EventBus,
  ) {}

  async createClaim(data: IClaim) {
    // console.log("FROM", data)
    if (!data.images) {
      throw new Error();
    }
    if (!data.status) {
      throw new Error();
    }
    const claim = new Claim(
      data.user_id,
      data.location,
      data.policyNumber,
      data.accidentDate,
      data.images,
      data.status,
    );
    if (!claim.isComplete()) {
      throw new UnprocessableEntityError("Claims is incomplete");
    }

    
    const savedClaim = await this.repo.create(claim);

    this.eventBus.publish({
      type: EventType.CLAIM_SUBMITTED,
      timestamp: new Date(),
      payload: claim,
    });
    console.log("FROM CLAIM SERVICE", savedClaim)
    return savedClaim;
  }
}
