import { EvidenceClient } from "./evidence.client";
import { EvidenceParser } from "./evidenceParser";
// import { AIPromptBuilder } from "./ai.promptBuilder";
import { EvidencePromptBuilder } from "./evidence. promptBuilder";

import type { EvidenceResult } from "./evidence.types";

export class EvidenceService {
  constructor(private client: EvidenceClient) {}

  async assessEvidence(images: string[]): Promise<EvidenceResult> {
    // 1. Build prompt (context engineering layer)
    const prompt = EvidencePromptBuilder.buildEvidenceAssessmentPrompt(images);

    // 2. Call model (external dependency layer)
    const rawResponse = await this.client.generate(prompt);

    const Evicenceparser = new EvidenceParser();
    const parsed = Evicenceparser.parse(rawResponse);

    return parsed;
  }
}
