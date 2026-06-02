import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";

import { DecisionEngine } from "./DecisionEngine";
import { Claim } from "@/modules/claims/claim.entity";
import { WebhookService } from "../webhook/webhook.service";
import { FraudAnalysis } from "@/modules/fraud/fraudAnalysis.entity";
import type { AIAssessmentResult } from "@/modules/ai/ai.types";

export class DecisionHandler {
  constructor(
    private eventBus: EventBus,
    private decisionEngine: DecisionEngine,
    private webhookService: WebhookService, 
  ) {}
  register() {
    console.log("Registering DecisionHandler...");
    this.eventBus.subscribe(EventType.AI_ANALYZED, async (event) => {
      const { claim, fraud, ai, callbackUrl  } = event.payload as {
        claim: Claim;
        fraud: FraudAnalysis;
        ai: AIAssessmentResult;
        callbackUrl?: string;
      };
      const decision = this.decisionEngine.evaluate(claim, fraud, ai);
      await this.eventBus.publish({
        type: EventType.DECISION_MADE,
        timestamp: new Date(),
        payload: { claim, fraud, ai, decision },
      });

       if (callbackUrl) {
        await this.webhookService.send(callbackUrl, {
          status:    "completed",
          data:      {
            decision,
            fraud: {
              score:     fraud.score,
              riskLevel: fraud.risk_level,
              reasons:   fraud.reasons,
            },
             ai: {
              summary:        ai.summary,
              recommendation: ai.recommendation,
              urgency:        ai.urgency,
              confidence:     ai.confidence,
            },
          },
          timestamp: new Date(),
        });
      }
    });
  }
}
