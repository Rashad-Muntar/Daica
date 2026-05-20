import { Claim } from "../claims/claim.entity";
import { FraudAnalysis } from "../fraud/fraudAnalysis.entity";

export class AIPromptBuilder {
  static buildClaimAssessmentPrompt(claim: Claim, fraud: FraudAnalysis): string {
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
- Policy Number: ${claim.policyNumber}
- Accident Date: ${claim.accidentDate}
- Accident Time: ${claim.accidentTime || "Not provided"}
- Location: ${claim.location}
- Lights On At Night: ${claim.lightsOnAtNight || "Not provided"}
- Accident Description: ${claim.accidentDescription || "Not provided"}
- Driver To Blame: ${claim.driverToBlame}
- Other Person To Blame: ${claim.otherPersonToBlame}
- Other Person Details: ${claim.otherPersonDetails || "Not provided"}
- Vehicle Damage Description: ${claim.vehicleDamageDescription || "Not provided"}
- Vehicle Can Be Seen At: ${claim.vehicleLocation || "Not provided"}
- Nearest Repairer: ${claim.nearestRepairer || "Not provided"}
- Estimated Repair Cost: ${claim.estimatedRepairCost || "Not provided"}
- Injured Person Details: ${claim.injuredPersonDetails || "Not provided"}
- Other Vehicle Reg/Model: ${claim.otherVehicleRegNumber || "Not provided"}
- Other Vehicle Make: ${claim.otherVehicleMake || "Not provided"}
- Other Vehicle Owner Address: ${claim.otherVehicleOwnerAddress || "Not provided"}
- Other Vehicle Insurer: ${claim.otherVehicleInsurerDetails || "Not provided"}
- Police Witnessed: ${claim.policeWitnessed}
- Police Took Particulars: ${claim.policeTookParticulars}
- Police Officer Name: ${claim.policeOfficerName || "Not provided"}
- Police Station: ${claim.policeStation || "Not provided"}
- Witness 1: ${claim.witness1 || "Not provided"}
- Witness 2: ${claim.witness2 || "Not provided"}
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