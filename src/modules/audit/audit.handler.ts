import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
import { AuditService } from "./audit.service";

export class AuditHandler {
  constructor(
    private eventBus: EventBus,
    private auditService: AuditService,
  ) {}

  register() {
    Object.values(EventType).forEach((type) => {
      this.eventBus.subscribe(type, async (event) => {
        const payload = event.payload as any;

        const entityId = payload.claim?.user_id || payload.user_id || "unknown";

        await this.auditService.log(type, entityId, payload);
      });
    });
  }
}
