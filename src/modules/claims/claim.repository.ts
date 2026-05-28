import { Claim } from "./claim.entity";
import { ClaimModel } from "./claim.model";
import { ClaimMapper } from "./claim.mapper";

export class ClaimRepository {
  async create(claim: Claim) {
    const createdClaim = await ClaimModel.create({
      user_id:                    claim.user_id,
      policyNumber:               claim.policyNumber,
      accidentDate:               claim.accidentDate,
      accidentTime:               claim.accidentTime,
      location:                   claim.location,
      images:                     claim.images ?? [],
      status:                     claim.status ?? "PENDING",
      driverToBlame:              claim.driverToBlame,
      otherPersonToBlame:         claim.otherPersonToBlame,
      otherPersonDetails:         claim.otherPersonDetails,
      accidentDescription:        claim.accidentDescription,
      lightsOnAtNight:            claim.lightsOnAtNight,
      vehicleDamageDescription:   claim.vehicleDamageDescription,
      vehicleLocation:            claim.vehicleLocation,
      nearestRepairer:            claim.nearestRepairer,
      estimatedRepairCost:        claim.estimatedRepairCost,
      repairInvoiceUrl:           claim.repairInvoiceUrl,
      injuredPersonDetails:       claim.injuredPersonDetails,
      doctorReportUrl:            claim.doctorReportUrl,
      otherVehicleRegNumber:      claim.otherVehicleRegNumber,
      otherVehicleMake:           claim.otherVehicleMake,
      otherVehicleOwnerAddress:   claim.otherVehicleOwnerAddress,
      otherVehicleInsurerDetails: claim.otherVehicleInsurerDetails,
      policeWitnessed:            claim.policeWitnessed,
      policeTookParticulars:      claim.policeTookParticulars,
      policeOfficerName:          claim.policeOfficerName,
      policeStation:              claim.policeStation,
      policeReportUrl:            claim.policeReportUrl,
      witness1:                   claim.witness1,
      witness2:                   claim.witness2,
      ghanaCardUrl:               claim.ghanaCardUrl,
    });

    return ClaimMapper.toEntity(createdClaim);
  }

  async findById(id: string) {
    return await ClaimModel.findById(id);
  }

  async updateStatus(id: string, status: string) {
    return ClaimModel.findByIdAndUpdate(id, { status }, { new: true });
  }
}