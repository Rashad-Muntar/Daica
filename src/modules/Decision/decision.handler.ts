import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";

import { DecisionEngine } from "./DecisionEngine";
import { Claim } from "@/modules/claims/claim.entity";
import { FraudAnalysis } from "@/modules/fraud/fraudAnalysis.entity";
import type { AIAssessmentResult } from "@/modules/ai/ai.types";

export class DecisionHandler {
  constructor(
    private eventBus: EventBus,
    private decisionEngine: DecisionEngine,
  ) {}
  register() {
    this.eventBus.subscribe(EventType.AI_ANALYZED, async (event) => {
      const { claim, fraud, ai } = event.payload as {
        claim: Claim;
        fraud: FraudAnalysis;
        ai: AIAssessmentResult;
      };
      const decision = this.decisionEngine.evaluate(claim, fraud, ai);
      await this.eventBus.publish({
        type: EventType.DECISION_MADE,
        timestamp: new Date(),
        payload: { claim, fraud, ai, decision },
      });
    });
  }
}
