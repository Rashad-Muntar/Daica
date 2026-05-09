import { Claim } from "./claim.entity";
import { ClaimRepository } from "./claim.repository";
import { UnprocessableEntityError } from "@/utils/errors";
import type { IClaim } from "./claim.type";

export class ClaimService {
  constructor(private repo: ClaimRepository) {}

  async createClaim(data: IClaim) {
    const claim = new Claim(
      data.user_id,
      data.description,
      data.location,
      data.images,
      data.status,
    );
    if (!claim.isComplete) {
      throw new UnprocessableEntityError("Claims is incomplete");
    }

    return this.repo.create(claim);
  }

  async flagClaim(id: string) {
    return this.repo.updateStatus(id, "FLAGGED");
  }
}
