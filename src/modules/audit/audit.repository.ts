import { AuditModel } from "./audit.model";

export class AuditRepository {
  async create(data: {
    eventType: string;
    entityId: string;
    payload: Record<string, unknown>;
  }) {
    return AuditModel.create(data);
  }
}