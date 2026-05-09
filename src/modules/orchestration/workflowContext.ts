import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import { Decision } from "../decision/decision.entity";

export class WorkflowContext{
    constructor(
        public claim: Claim,
        public fraudAnalysis: FraudAnalysis,
        public decision: Decision,
        public conversationHistory: string[] = []
    ){}

    addMessage(message: string){
        this.conversationHistory.push(message)
    }
}