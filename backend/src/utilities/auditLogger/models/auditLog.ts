import mongoose, { Schema, Document } from "mongoose";

export interface IAuditLog extends Document {
  actionType: "CHANGE_PASSWORD" | "QUERY_ACCOUNT";
  IDIR: string;
  email?: string;
  oracleID: string;
  environment: string[];
  details?: object;
  status: "SUCCESS" | "FAILURE";
  message?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>({
  actionType: {
    type: String,
    required: true,
    enum: ["CHANGE_PASSWORD", "QUERY_ACCOUNT"],
  },
  IDIR: { type: String, required: true },
  oracleID: { type: String, required: true },
  environment: { type: [String], required: true },
  email: { type: String },
  details: { type: Object },
  status: { type: String, required: true, enum: ["SUCCESS", "FAILURE"] },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// In case we decide to automatically delete logs older than 90 days
// auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60*60*24*90 });

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
