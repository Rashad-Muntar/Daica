export class Claim {
  constructor(
    public user_id: string,
    public location: string,
    public policyNumber: string,
    public accidentDate: Date,
    public accidentTime: string,
    public images: string[],
    public status: string,

    // Blame
    public driverToBlame: boolean,
    public otherPersonToBlame: boolean,
    public otherPersonDetails: string,

    // Accident
    public accidentDescription: string,
    public lightsOnAtNight: string,

    // Vehicle damage
    public vehicleDamageDescription: string,
    public vehicleLocation: string,
    public nearestRepairer: string,
    public estimatedRepairCost: number,
    public injuredPersonDetails: string,

    // Other vehicle
    public otherVehicleRegNumber: string,
    public otherVehicleMake: string,
    public otherVehicleOwnerAddress: string,
    public otherVehicleInsurerDetails: string,

    // Police
    public policeWitnessed: boolean,
    public policeTookParticulars: boolean,
    public policeOfficerName: string,
    public policeStation: string,

    // Witnesses
    public witness1: string,
    public witness2: string,
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
