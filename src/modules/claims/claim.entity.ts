import type { InjuredPersonDetails } from "./claim.type";

export class Claim {
  constructor(
    public user_id: string,
    public location: string,
    public policyNumber: string,
    public accidentDate: Date,
    public accidentTime: string,
    public vehicleImages: string[],
    public status: string,
    public driverToBlame: boolean = false,
    public otherPersonToBlame: boolean = false,
    public otherPersonDetails: string = "",
    public accidentDescription: string = "",
    public lightsOnAtNight: string = "",
    public vehicleDamageDescription: string = "",
    public vehicleLocation: string = "",
    public nearestRepairer: string = "",
    public estimatedRepairCost: number = 0,
    public repairInvoiceUrl: string = "",
    public injuredPersonDetails: InjuredPersonDetails[] = [],
    public doctorReportUrl: string = "",
    public otherVehicleRegNumber: string = "",
    public otherVehicleMake: string = "",
    public otherVehicleOwnerAddress: string = "",
    public otherVehicleInsurerDetails: string = "",
    public policeWitnessed: boolean = false,
    public policeTookParticulars: boolean = false,
    public policeOfficerName: string = "",
    public policeStation: string = "",
    public policeReportUrl: string = "",
    public witness1: string = "",
    public witness2: string = "",
    public ghanaCardUrl: string = "",
    public imageHashes: string[],
    public policeReportHash: string = "",
    public repairInvoiceHash: string = "",
    public ghanaCardHash: string = "",
    public doctorReportHash: string = "",
    public policeReportPHash: string = "",
    public repairInvoicePHash: string = "",
    public ghanaCardPHash: string = "",
    public doctorReportPHash: string = "",
    public imagePHashes: string[] = [],
  ) {}

  updateStatus(status: ClaimStatus) {
    this.status = status;
  }

  isComplete(): boolean {
    return !!(
      this.location &&
      this.policyNumber &&
      this.accidentDate &&
      this.accidentDescription &&
      this.vehicleDamageDescription
    );
  }
}

export enum ClaimStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
}
