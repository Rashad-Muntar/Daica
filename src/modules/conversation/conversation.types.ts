import type { InjuredPersonDetails } from "../claims/claim.type";

export enum ClaimStep {
  START = "START",
  AWAITING_POLICY_NUMBER = "AWAITING_POLICY_NUMBER",
  AWAITING_DATE = "AWAITING_DATE",
  AWAITING_TIME = "AWAITING_TIME",
  AWAITING_LOCATION = "AWAITING_LOCATION",
  AWAITING_DESCRIPTION = "AWAITING_DESCRIPTION",
  AWAITING_BLAME = "AWAITING_BLAME",
  AWAITING_OTHER_PERSON_DETAILS = "AWAITING_OTHER_PERSON_DETAILS",
  AWAITING_DAMAGE_DESCRIPTION = "AWAITING_DAMAGE_DESCRIPTION",
  AWAITING_VEHICLE_LOCATION = "AWAITING_VEHICLE_LOCATION",
  AWAITING_REPAIRER = "AWAITING_REPAIRER",
  AWAITING_REPAIR_COST = "AWAITING_REPAIR_COST",
  AWAITING_REPAIR_INVOICE = "AWAITING_REPAIR_INVOICE",
  AWAITING_INJURED_DETAILS = "AWAITING_INJURED_DETAILS",
  AWAITING_INJURED_PERSON_NAME = "AWAITING_INJURED_PERSON_NAME",
  AWAITING_INJURED_PERSON_PHONE = "AWAITING_INJURED_PERSON_PHONE",
  AWAITING_INJURED_PERSON_SEVERITY = "AWAITING_INJURED_PERSON_SEVERITY",
  AWAITING_MORE_INJURED = "AWAITING_MORE_INJURED",
  AWAITING_DOCTOR_REPORT = "AWAITING_DOCTOR_REPORT",
  AWAITING_OTHER_VEHICLE_REG = "AWAITING_OTHER_VEHICLE_REG",
  AWAITING_OTHER_VEHICLE_MAKE = "AWAITING_OTHER_VEHICLE_MAKE",
  AWAITING_OTHER_VEHICLE_OWNER = "AWAITING_OTHER_VEHICLE_OWNER",
  AWAITING_OTHER_VEHICLE_INSURER = "AWAITING_OTHER_VEHICLE_INSURER",
  AWAITING_POLICE_WITNESSED = "AWAITING_POLICE_WITNESSED",
  AWAITING_POLICE_PARTICULARS = "AWAITING_POLICE_PARTICULARS",
  AWAITING_POLICE_OFFICER = "AWAITING_POLICE_OFFICER",
  AWAITING_POLICE_STATION = "AWAITING_POLICE_STATION",
  AWAITING_POLICE_REPORT = "AWAITING_POLICE_REPORT",
  AWAITING_WITNESS1 = "AWAITING_WITNESS1",
  AWAITING_WITNESS2 = "AWAITING_WITNESS2",
  AWAITING_GHANA_CARD = "AWAITING_GHANA_CARD",
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
    locationCoords?: { latitude: number; longitude: number };
    lightsOnAtNight?: string;
    accidentDescription?: string;
    driverToBlame?: boolean;
    otherPersonToBlame?: boolean;
    otherPersonDetails?: string;
    vehicleDamageDescription?: string;
    vehicleLocation?: string;
    nearestRepairer?: string;
    estimatedRepairCost?: number;
    repairInvoiceUrl?: string;

    // Injured persons — array built one-by-one
    injuredPersonDetails?: InjuredPersonDetails[];
    currentInjuredPerson?: Partial<InjuredPersonDetails>; // ← temp while collecting
    doctorReportUrl?: string;

    otherVehicleRegNumber?: string;
    otherVehicleMake?: string;
    otherVehicleOwnerAddress?: string;
    otherVehicleInsurerDetails?: string;
    policeWitnessed?: boolean;
    policeTookParticulars?: boolean;
    policeOfficerName?: string;
    policeStation?: string;
    policeReportUrl?: string;
    witness1?: string;
    witness2?: string;
    ghanaCardUrl?: string;
    vehicleImages?: string[];
    policyHolderId?: string;
  };
}
