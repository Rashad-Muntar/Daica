import { Claim } from "./claim.entity";
import { ClaimModel } from "./claim.model";
import { ClaimMapper } from "./claim.mapper";

export class ClaimRepository {
  async create(claim: Claim) {
    const createdClaim = await ClaimModel.create({
      user_id: claim.user_id,
      policyNumber: claim.policyNumber,
      accidentDate: claim.accidentDate,
      accidentTime: claim.accidentTime,
      location: claim.location,
      vehicleImages: claim.vehicleImages ?? [],
      status: claim.status ?? "PENDING",
      driverToBlame: claim.driverToBlame,
      otherPersonToBlame: claim.otherPersonToBlame,
      otherPersonDetails: claim.otherPersonDetails,
      accidentDescription: claim.accidentDescription,
      lightsOnAtNight: claim.lightsOnAtNight,
      vehicleDamageDescription: claim.vehicleDamageDescription,
      vehicleLocation: claim.vehicleLocation,
      nearestRepairer: claim.nearestRepairer,
      estimatedRepairCost: claim.estimatedRepairCost,
      repairInvoiceUrl: claim.repairInvoiceUrl,
      injuredPersonDetails: claim.injuredPersonDetails,
      doctorReportUrl: claim.doctorReportUrl,
      otherVehicleRegNumber: claim.otherVehicleRegNumber,
      otherVehicleMake: claim.otherVehicleMake,
      otherVehicleOwnerAddress: claim.otherVehicleOwnerAddress,
      otherVehicleInsurerDetails: claim.otherVehicleInsurerDetails,
      policeWitnessed: claim.policeWitnessed,
      policeTookParticulars: claim.policeTookParticulars,
      policeOfficerName: claim.policeOfficerName,
      policeStation: claim.policeStation,
      policeReportUrl: claim.policeReportUrl,
      witness1: claim.witness1,
      witness2: claim.witness2,
      ghanaCardUrl: claim.ghanaCardUrl,
      imageHashes: claim.imageHashes || [],
      policeReportHash: claim.policeReportHash || "",
      repairInvoiceHash: claim.repairInvoiceHash || "",
      ghanaCardHash: claim.ghanaCardHash || "",
      doctorReportHash: claim.doctorReportHash || "",

      policeReportPHash: claim.policeReportPHash || "",
      repairInvoicePHash: claim.repairInvoicePHash || "",
      ghanaCardPHash: claim.ghanaCardPHash || "",
      doctorReportPHash: claim.doctorReportPHash || "",
      imagePHashes: claim.imagePHashes || [],
    });

    return ClaimMapper.toEntity(createdClaim);
  }

  async findById(id: string) {
    return await ClaimModel.findById(id);
  }

  async find(filter: Partial<Claim>) {
    return await ClaimModel.find(filter);
  }

  async updateStatus(id: string, status: string) {
    return ClaimModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  // ─── Count claims by user — used for repeat claimant fraud check ──────────
  async countByUserId(
    userId: string,
    excludeClaimId?: string,
  ): Promise<number> {
    return ClaimModel.countDocuments({
      user_id: userId,
      ...(excludeClaimId ? { _id: { $ne: excludeClaimId } } : {}),
    });
  }

  // ─── Find claim by any document hash — used for exact duplicate check ─────
  async findByDocumentHash(
    hash: string,
    excludeClaimId?: string,
  ): Promise<{ id: string; [key: string]: any } | null> {
    const doc = await ClaimModel.findOne(
      {
        ...(excludeClaimId ? { _id: { $ne: excludeClaimId } } : {}),
        $or: [
          { imageHashes: hash },
          { policeReportHash: hash },
          { repairInvoiceHash: hash },
          { ghanaCardHash: hash },
          { doctorReportHash: hash },
        ],
      },
      // Only return the fields we need — keeps it lean
      {
        _id: 1,
        policeReportUrl: 1,
        repairInvoiceUrl: 1,
        ghanaCardUrl: 1,
        doctorReportUrl: 1,
        images: 1,
      },
    );

    return doc ? { id: doc._id.toString(), ...doc.toObject() } : null;
  }

  // ─── Fetch all perceptual hashes for a specific doc type ──────────────────
  // Used for visual similarity comparison across all claims
  async findAllPHashes(
    field: string,
    excludeClaimId?: string,
  ): Promise<Array<{ id: string; hash: string }>> {
    const docs = await ClaimModel.find(
      {
        ...(excludeClaimId ? { _id: { $ne: excludeClaimId } } : {}),
        [field]: { $exists: true, $ne: null }, // only claims that have this hash
      },
      { _id: 1, [field]: 1 }, // lean projection
    );

    return docs
      .map((doc) => {
        const plain = doc.toObject() as Record<string, any>; // ← cast to plain object
        return {
          id: doc._id.toString(),
          hash: plain[field] as string,
        };
      })
      .filter((d) => !!d.hash);
  }

  // ─── Save document hashes after claim is created ──────────────────────────
  async saveDocumentHashes(
    claimId: string,
    hashes: {
      imageHashes?: string[];
      policeReportHash?: string;
      repairInvoiceHash?: string;
      ghanaCardHash?: string;
      doctorReportHash?: string;
      policeReportPHash?: string;
      repairInvoicePHash?: string;
      ghanaCardPHash?: string;
      doctorReportPHash?: string;
      imagePHashes?: string[];
    },
  ): Promise<void> {
    await ClaimModel.findByIdAndUpdate(claimId, { $set: hashes });
  }
}
