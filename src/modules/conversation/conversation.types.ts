export enum ClaimStep {
  START = "START",
  AWAITING_NUMBER = "AWAITING_NUMBER",
  AWAITING_POLICY_NUMBER = "AWAITING_POLICY_NUMBER",
  AWAITING_DATE = "AWAITING_DATE",
  AWAITING_TIME = "AWAITING_TIME",
  AWAITING_LOCATION = "AWAITING_LOCATION",
  AWAITING_LIGHTS = "AWAITING_LIGHTS",
  AWAITING_DESCRIPTION = "AWAITING_DESCRIPTION",
  AWAITING_BLAME = "AWAITING_BLAME",
  AWAITING_OTHER_PERSON_DETAILS = "AWAITING_OTHER_PERSON_DETAILS",
  AWAITING_DAMAGE_DESCRIPTION = "AWAITING_DAMAGE_DESCRIPTION",
  AWAITING_VEHICLE_LOCATION = "AWAITING_VEHICLE_LOCATION",
  AWAITING_REPAIRER = "AWAITING_REPAIRER",
  AWAITING_REPAIR_COST = "AWAITING_REPAIR_COST",
  AWAITING_INJURED_DETAILS = "AWAITING_INJURED_DETAILS",
  AWAITING_OTHER_VEHICLE_REG = "AWAITING_OTHER_VEHICLE_REG",
  AWAITING_OTHER_VEHICLE_MAKE = "AWAITING_OTHER_VEHICLE_MAKE",
  AWAITING_OTHER_VEHICLE_OWNER = "AWAITING_OTHER_VEHICLE_OWNER",
  AWAITING_OTHER_VEHICLE_INSURER = "AWAITING_OTHER_VEHICLE_INSURER",
  AWAITING_POLICE_WITNESSED = "AWAITING_POLICE_WITNESSED",
  AWAITING_POLICE_PARTICULARS = "AWAITING_POLICE_PARTICULARS",
  AWAITING_POLICE_OFFICER = "AWAITING_POLICE_OFFICER",
  AWAITING_POLICE_STATION = "AWAITING_POLICE_STATION",
  AWAITING_WITNESS1 = "AWAITING_WITNESS1",
  AWAITING_WITNESS2 = "AWAITING_WITNESS2",
  AWAITING_IMAGES = "AWAITING_IMAGES",
  COMPLETE = "COMPLETE",
}

export interface ConversationState {
  userId: string;
  currentStep: ClaimStep;
  nextStep: ClaimStep;
  lastMessage: string;
  updatedAt: Date;
  goBack: string;
  data: {
    vehicleNumber?: string;
    policyNumber?: string;
    accidentDate?: string;
    accidentTime?: string;
    location?: string;
    locationCoords?: {
      latitude: number;
      longitude: number;
    };
    lightsOnAtNight?: string;
    accidentDescription?: string;
    driverToBlame?: boolean;
    otherPersonToBlame?: boolean;
    otherPersonDetails?: string;
    vehicleDamageDescription?: string;
    vehicleLocation?: string;
    nearestRepairer?: string;
    estimatedRepairCost?: number;
    injuredPersonDetails?: string;
    otherVehicleRegNumber?: string;
    otherVehicleMake?: string;
    otherVehicleOwnerAddress?: string;
    otherVehicleInsurerDetails?: string;
    policeWitnessed?: boolean;
    policeTookParticulars?: boolean;
    policeOfficerName?: string;
    policeStation?: string;
    witness1?: string;
    witness2?: string;
    images?: string[];
  };
}
