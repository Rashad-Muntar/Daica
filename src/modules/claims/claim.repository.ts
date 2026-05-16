import { Claim } from "./claim.entity";
import { ClaimModel } from "./claim.model";
import { ClaimMapper } from "./claim.mapper";

export class ClaimRepository {
  async create(claim: Claim) {
    const createdClaim = await ClaimModel.create({
      user_id: claim.user_id,
      policyNumber: claim.policyNumber,
      accidentDate: claim.accidentDate,
      vehicleNumber: claim.vehicleNumber,
      location: claim.location,
      images: claim.images ?? [],
      status: claim.status ?? "PENDING",
    });

    return ClaimMapper.toEntity(createdClaim);
  }

  async findById(id: string) {
    return await ClaimModel.findById(id);
  }
  async updateStatus(id: string, status: string) {
    return ClaimModel.findByIdAndUpdate(id, { status: status }, { new: true });
  }
}
