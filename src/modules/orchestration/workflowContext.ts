import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import { Decision } from "../decision/decision.entity";
import type { IClaim } from "../claims/claim.type";

export class WorkflowContext {
  constructor(
    public claim: IClaim,
    public fraudAnalysis: FraudAnalysis,
    public decision: Decision,
    public conversationHistory: string[] = [],
  ) {}

  addMessage(message: string) {
    this.conversationHistory.push(message);
  }
}
