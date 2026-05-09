import mongoose, { Schema, Document } from "mongoose";

export interface ClaimDocument extends Document {
  user_id: string;
  description: string;
  location: string;
  images: string[];
  status: string;
  createdAt: Date;
}

const ClaimSchema = new Schema<ClaimDocument>(
  {
    user_id: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED", "FLAGGED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export const ClaimModel = mongoose.model<ClaimDocument>("Claim", ClaimSchema);
