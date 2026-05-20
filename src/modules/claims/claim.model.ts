import mongoose, { Schema, Document } from "mongoose";

export interface ClaimDocument extends Document {
  user_id: string;
  policyNumber: string;
  accidentDate: Date;
  accidentTime: string;
  location: string;
  images: string[];
  status: string;
  createdAt: Date;

  // Blame
  driverToBlame: boolean;
  otherPersonToBlame: boolean;
  otherPersonDetails: string;

  // Accident
  accidentDescription: string;
  lightsOnAtNight: string;

  // Vehicle damage
  vehicleDamageDescription: string;
  vehicleLocation: string;
  nearestRepairer: string;
  estimatedRepairCost: number;
  injuredPersonDetails: string;

  // Other vehicle
  otherVehicleRegNumber: string;
  otherVehicleMake: string;
  otherVehicleOwnerAddress: string;
  otherVehicleInsurerDetails: string;

  // Police
  policeWitnessed: boolean;
  policeTookParticulars: boolean;
  policeOfficerName: string;
  policeStation: string;

  // Witnesses
  witness1: string;
  witness2: string;
}

const ClaimSchema = new Schema<ClaimDocument>(
  {
    user_id:      { type: String, required: true },
    policyNumber: { type: String, required: true },
    accidentDate: { type: Date,   required: true },
    accidentTime: { type: String, required: false },
    location:     { type: String, required: true },
    images:       { type: [String], default: [] },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "FLAGGED"],
      default: "PENDING",
    },

    // Blame
    driverToBlame:      { type: Boolean, default: false },
    otherPersonToBlame: { type: Boolean, default: false },
    otherPersonDetails: { type: String,  required: false },

    // Accident
    accidentDescription: { type: String, required: false },
    lightsOnAtNight:     { type: String, required: false },

    // Vehicle damage
    vehicleDamageDescription: { type: String, required: false },
    vehicleLocation:          { type: String, required: false },
    nearestRepairer:          { type: String, required: false },
    estimatedRepairCost:      { type: Number, default: 0 },
    injuredPersonDetails:     { type: String, required: false },

    // Other vehicle
    otherVehicleRegNumber:    { type: String, required: false },
    otherVehicleMake:         { type: String, required: false },
    otherVehicleOwnerAddress: { type: String, required: false },
    otherVehicleInsurerDetails: { type: String, required: false },

    // Police
    policeWitnessed:        { type: Boolean, default: false },
    policeTookParticulars:  { type: Boolean, default: false },
    policeOfficerName:      { type: String,  required: false },
    policeStation:          { type: String,  required: false },

    // Witnesses
    witness1: { type: String, required: false },
    witness2: { type: String, required: false },
  },
  { timestamps: true },
);

export const ClaimModel = mongoose.model<ClaimDocument>("Claim", ClaimSchema);