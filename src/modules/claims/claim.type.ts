export interface IClaim {
  user_id: string;
  accidentDate: Date;
  accidentTime?: string;
  policyNumber: string;
  location: string;
  images?: string[];
  status?: string;

  driverToBlame?: boolean | undefined;
  otherPersonToBlame?: boolean | undefined;
  otherPersonDetails?: string | undefined;
  accidentDescription?: string | undefined;
  lightsOnAtNight?: string | undefined;
  vehicleDamageDescription?: string | undefined;
  vehicleLocation?: string | undefined;
  nearestRepairer?: string | undefined;
  estimatedRepairCost?: number | undefined;
  injuredPersonDetails?: string | undefined;
  otherVehicleRegNumber?: string | undefined;
  otherVehicleMake?: string | undefined;
  otherVehicleOwnerAddress?: string | undefined;
  otherVehicleInsurerDetails?: string | undefined;
  policeWitnessed?: boolean | undefined;
  policeTookParticulars?: boolean | undefined;
  policeOfficerName?: string | undefined;
  policeStation?: string | undefined;
  witness1?: string | undefined;
  witness2?: string | undefined;

  isComplete?: () => boolean;
}
