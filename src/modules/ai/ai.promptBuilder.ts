import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";


export class AIPromptBuilder {
  static buildClaimAssessmentPrompt(
    claim: Claim,
    fraud: FraudAnalysis,
  ): string {
    return `
You are an insurance claims assessment assistant in Ghana with the expertice of analysing and detecting insurance claims fraud.

Very important: Claim failing requirement should look at in the Ghanaian context. Example in filling for claim, the client does not provide claim amount. Since the policy number is requested we fetch the claim amount based on the policy number.

Analyze the submitted claim objectively.

Your responsibilities:
- Summarize the incident
- Detect missing information
- Identify contradictions
- Estimate urgency
- Recommend next action

Claim Data:
- User ID: ${claim.user_id}
- AccidentDate: ${claim.accidentDate}
- Location: ${claim.location}
- Images: ${claim.images.join(", ")}
- Status: ${claim.status}

Fraud Analysis:
- Fraud Score: ${fraud.score}
- Risk Level: ${fraud.risk_level}
- Fraud Reasons: ${fraud.reasons.join(", ")}

Return ONLY valid JSON in this exact format: No commentary or statement.

{
  "summary": "",
  "missingInformation": [],
  "contradictions": [],
  "urgency": "LOW | MEDIUM | HIGH",
  "recommendation": "APPROVE | REJECT | ESCALATE | REQUEST_MORE_INFO",
  "confidence": 0
}
`;
  }
}
