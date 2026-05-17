import { AIClient } from "./ai.client";
import { AIResponseParser } from "./ai.responseParser";
import { AIPromptBuilder } from "./ai.promptBuilder";

import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";
import type { AIAssessmentResult } from "./ai.types";

export class AIService {
  constructor(private client: AIClient) {}

  async assessClaim(
    claim: Claim,
    fraud: FraudAnalysis,
  ): Promise<AIAssessmentResult> {
    // 1. Build prompt (context engineering layer)
    const prompt = AIPromptBuilder.buildClaimAssessmentPrompt(claim, fraud);

    // 2. Call model (external dependency layer)
    const rawResponse = await this.client.generate(prompt);

    // 3. Parse + validate (safety layer)
    const parsed = AIResponseParser.parse(rawResponse);

    return parsed;
  }
}
