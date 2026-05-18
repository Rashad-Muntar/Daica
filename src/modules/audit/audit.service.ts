import { AuditRepository } from "./audit.repository";

export class AuditService {
  constructor(
    private repo: AuditRepository,
  ) {}

  async log(
    eventType: string,
    entityId: string,
    payload: Record<string, unknown>,
  ) {
    await this.repo.create({
      eventType,
      entityId,
      payload,
    });
  }
}