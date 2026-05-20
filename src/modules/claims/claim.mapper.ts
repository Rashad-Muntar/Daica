import { Claim } from "./claim.entity";
import type { ClaimDocument } from "./claim.model";

export class ClaimMapper {
  static toEntity(document: ClaimDocument): Claim {
    return new Claim(
      document.user_id,
      document.location,
      document.policyNumber,
      document.accidentDate,
      document.accidentTime,
      document.images,
      document.status,
      document.driverToBlame,
      document.otherPersonToBlame,
      document.otherPersonDetails,
      document.accidentDescription,
      document.lightsOnAtNight,
      document.vehicleDamageDescription,
      document.vehicleLocation,
      document.nearestRepairer,
      document.estimatedRepairCost,
      document.injuredPersonDetails,
      document.otherVehicleRegNumber,
      document.otherVehicleMake,
      document.otherVehicleOwnerAddress,
      document.otherVehicleInsurerDetails,
      document.policeWitnessed,
      document.policeTookParticulars,
      document.policeOfficerName,
      document.policeStation,
      document.witness1,
      document.witness2,
    );
  }
}
