export interface InjuredPersonDetails {
  name: string;
  phoneNumber: string;
  severity: string;
}

export interface IClaim {
  user_id: string;
  accidentDate: Date;
  accidentTime?: string | undefined;
  policyNumber: string;
  location: string;
  images?: string[] | undefined;
  status?: string | undefined;
  driverToBlame?: boolean | undefined;
  otherPersonToBlame?: boolean | undefined;
  otherPersonDetails?: string | undefined;
  accidentDescription?: string | undefined;
  lightsOnAtNight?: string | undefined;
  vehicleDamageDescription?: string | undefined;
  vehicleLocation?: string | undefined;
  nearestRepairer?: string | undefined;
  estimatedRepairCost?: number | undefined;
  repairInvoiceUrl?: string | undefined;
  injuredPersonDetails?: InjuredPersonDetails[] | undefined;
  doctorReportUrl?: string | undefined;
  otherVehicleRegNumber?: string | undefined;
  otherVehicleMake?: string | undefined;
  otherVehicleOwnerAddress?: string | undefined;
  otherVehicleInsurerDetails?: string | undefined;
  policeWitnessed?: boolean | undefined;
  policeTookParticulars?: boolean | undefined;
  policeOfficerName?: string | undefined;
  policeStation?: string | undefined;
  policeReportUrl?: string | undefined;
  witness1?: string | undefined;
  witness2?: string | undefined;
  ghanaCardUrl?: string | undefined;
  isComplete?: (() => boolean) | undefined;
}
