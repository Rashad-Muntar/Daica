import { Claim } from "./claim.entity";
import { ClaimModel } from "./claim.model";

export class ClaimRepository {
  async create(claim: Claim) {
    const createdClaim = await ClaimModel.create({
      user_id: claim.user_id,
      description: claim.description,
      location: claim.location,
      images: claim.images,
      status: claim.status,
    });

    return createdClaim;
  }

  async findById(id: string) {
    return await ClaimModel.findById(id);
  }
  async updateStatus(id: string, status: string) {
    return ClaimModel.findByIdAndUpdate(id, { status: status }, { new: true });
  }
}
