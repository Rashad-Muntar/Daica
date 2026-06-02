import mongoose, { Schema, Document } from "mongoose";

interface InjuredPersonDetails {
  name: string;
  phoneNumber: string;
  severity: string;
}

export interface ClaimDocument extends Document {
  user_id: string;
  policyNumber: string;
  accidentDate: Date;
  accidentTime: string;
  location: string;
  vehicleImages: string[];
  status: string;
  createdAt: Date;

  driverToBlame: boolean;
  otherPersonToBlame: boolean;
  otherPersonDetails: string;
  accidentDescription: string;
  lightsOnAtNight: string;
  vehicleDamageDescription: string;
  vehicleLocation: string;
  nearestRepairer: string;
  estimatedRepairCost: number;
  repairInvoiceUrl: string;
  injuredPersonDetails: InjuredPersonDetails[];
  doctorReportUrl: string;
  otherVehicleRegNumber: string;
  otherVehicleMake: string;
  otherVehicleOwnerAddress: string;
  otherVehicleInsurerDetails: string;
  policeWitnessed: boolean;
  policeTookParticulars: boolean;
  policeOfficerName: string;
  policeStation: string;
  policeReportUrl: string;
  witness1: string;
  witness2: string;
  ghanaCardUrl?: string;
  imageHashes: string[];
  policeReportHash: string;
  repairInvoiceHash: string;
  ghanaCardHash: string;
  doctorReportHash: string;
  policeReportPHash?: string;
  repairInvoicePHash?: string;
  ghanaCardPHash?: string;
  doctorReportPHash?: string;
  imagePHashes?: string[];
}

const InjuredPersonSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    severity: { type: String, required: true },
  },
  { _id: false },
);

const ClaimSchema = new Schema<ClaimDocument>(
  {
    user_id: { type: String, required: true },
    policyNumber: { type: String, required: true },
    accidentDate: { type: Date, required: true },
    accidentTime: { type: String, required: false },
    location: { type: String, required: true },
    imageHashes: { type: [String], default: [] },
    policeReportHash: { type: String, required: false },
    repairInvoiceHash: { type: String, required: false },
    ghanaCardHash: { type: String, required: false },
    doctorReportHash: { type: String, required: false },
    vehicleImages: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "FLAGGED"],
      default: "PENDING",
    },
    driverToBlame: { type: Boolean, default: false },
    otherPersonToBlame: { type: Boolean, default: false },
    otherPersonDetails: { type: String, required: false },
    accidentDescription: { type: String, required: false },
    lightsOnAtNight: { type: String, required: false },
    vehicleDamageDescription: { type: String, required: false },
    vehicleLocation: { type: String, required: false },
    nearestRepairer: { type: String, required: false },
    estimatedRepairCost: { type: Number, default: 0 },
    repairInvoiceUrl: { type: String, required: false },
    injuredPersonDetails: { type: [InjuredPersonSchema], default: [] },
    doctorReportUrl: { type: String, required: false },
    otherVehicleRegNumber: { type: String, required: false },
    otherVehicleMake: { type: String, required: false },
    otherVehicleOwnerAddress: { type: String, required: false },
    otherVehicleInsurerDetails: { type: String, required: false },
    policeWitnessed: { type: Boolean, default: false },
    policeTookParticulars: { type: Boolean, default: false },
    policeOfficerName: { type: String, required: false },
    policeStation: { type: String, required: false },
    policeReportUrl: { type: String, required: false },
    witness1: { type: String, required: false },
    witness2: { type: String, required: false },
    ghanaCardUrl: { type: String, required: false },
    policeReportPHash: { type: String, required: false },
    repairInvoicePHash: { type: String, required: false },
    ghanaCardPHash: { type: String, required: false },
    doctorReportPHash: { type: String, required: false },
    imagePHashes: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const ClaimModel = mongoose.model<ClaimDocument>("Claim", ClaimSchema);
