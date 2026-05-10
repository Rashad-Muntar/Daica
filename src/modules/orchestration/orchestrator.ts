import { WorkflowContext } from "./workflowContext";
import { ToolRegistry } from "./toolRegistry";
import type { IClaim } from "../claims/claim.type";

export class Orchestrator {
  constructor(private tools: ToolRegistry) {}

  async handleClaimSubmission(input: IClaim): Promise<WorkflowContext> {
    const claim = await this.tools.createClaim(input);
    const fraud = await this.tools.analyzeFraud(claim);
    const decision = await this.tools.evaluateDecision(claim, fraud);
    const context = new WorkflowContext(claim, fraud, decision);

    return context;
  }
}
