import mongoose, { Schema, Document } from "mongoose";

export interface FraudDocument extends Document {
  claim_id: string;
  score: number;
  risk_level: string;
  reasons: string[];
}

const FraudSchema = new Schema(
  {
    claim_id: String,

    score: Number,

    risk_level: String,

    reasons: [String],
  },
  {
    timestamps: true,
  }
);

export const FraudModel = mongoose.model(
  "FraudAnalysis",
  FraudSchema
);