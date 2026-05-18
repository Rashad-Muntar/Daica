import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";
import { WhatssapClient } from "@/integrations/whatssap/whatssapClient";
import type { Claim } from "../claims/claim.entity";
import type { Decision } from "../decision/decision.entity";

export class NotificationHandler {
  constructor(
    private eventBus: EventBus,
    private whatsappClient: WhatssapClient,
  ) {}

  register() {
    this.eventBus.subscribe(
      EventType.DECISION_MADE,
      async (event) => {
        const { claim, decision } = event.payload as {claim: Claim, decision: Decision};

        const message = this.buildDecisionMessage(decision);

        await this.whatsappClient.sendText(
          claim.user_id,
          message,
        );
      },
    );
  }

  private buildDecisionMessage(decision: any): string {
    switch (decision.type) {
      case "APPROVE":
        return "✅ Your claim has been approved and is under processing.";

      case "REQUEST_MORE_INFO":
        return `⚠ We need more information: ${decision.reason}`;

      case "ESCALATE":
        return "🔎 Your claim requires manual review. Our team will contact you.";

      case "REJECT":
        return `❌ Claim rejected: ${decision.reason}`;

      default:
        return "Your claim is under review.";
    }
  }
}