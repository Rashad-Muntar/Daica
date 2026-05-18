import mongoose, { Schema, Document } from "mongoose";

export interface AuditDocument extends Document {
  eventType: string;
  entityId: string;
  payload: Record<string, unknown>;
  createdAt: Date;
}

const AuditSchema = new Schema<AuditDocument>(
  {
    eventType: { type: String, required: true },
    entityId: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

export const AuditModel = mongoose.model("AuditLog", AuditSchema);
