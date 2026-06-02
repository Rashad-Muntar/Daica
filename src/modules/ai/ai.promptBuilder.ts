import type { Claim } from "../claims/claim.entity";
import type { FraudAnalysis } from "../fraud/fraudAnalysis.entity";

// ─── Claim Assessment ────────────────────────────────────────────────────────
export class ClaimAssessmentPromptBuilder {
  static build(claim: Claim, fraud: FraudAnalysis): string {
    return `
You are an insurance claims assessment assistant in Ghana with expertise in analysing and detecting insurance claims fraud.

Very important: Claim failing requirements should be looked at in the Ghanaian context. Since the policy number is provided we fetch the claim amount based on it.

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
- Accident Description: ${claim.accidentDescription || "Not provided"}
- Driver To Blame: ${claim.driverToBlame}
- Other Person To Blame: ${claim.otherPersonToBlame}
- Other Person Details: ${claim.otherPersonDetails || "Not provided"}
- Vehicle Damage: ${claim.vehicleDamageDescription || "Not provided"}
- Vehicle Location: ${claim.vehicleLocation || "Not provided"}
- Nearest Repairer: ${claim.nearestRepairer || "Not provided"}
- Estimated Repair Cost: ${claim.estimatedRepairCost || "Not provided"}
- Injured Persons: ${JSON.stringify(claim.injuredPersonDetails) || "Not provided"}
- Other Vehicle Reg: ${claim.otherVehicleRegNumber || "Not provided"}
- Other Vehicle Make: ${claim.otherVehicleMake || "Not provided"}
- Other Vehicle Owner: ${claim.otherVehicleOwnerAddress || "Not provided"}
- Other Vehicle Insurer: ${claim.otherVehicleInsurerDetails || "Not provided"}
- Police Witnessed: ${claim.policeWitnessed}
- Police Took Particulars: ${claim.policeTookParticulars}
- Police Officer: ${claim.policeOfficerName || "Not provided"}
- Police Station: ${claim.policeStation || "Not provided"}
- Witness 1: ${claim.witness1 || "Not provided"}
- Witness 2: ${claim.witness2 || "Not provided"}
- Status: ${claim.status}

Fraud Analysis:
- Fraud Score: ${fraud.score}
- Risk Level: ${fraud.risk_level}
- Fraud Reasons: ${fraud.reasons.join(", ")}

Return ONLY valid JSON. No commentary or statement.

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

// ─── Vehicle Damage Evidence ─────────────────────────────────────────────────
export class DamageEvidencePromptBuilder {
  static buildDamageCheck(imageCount: number): string {
    return `
You are an insurance vehicle damage analyst.

Analyze all ${imageCount} image(s) provided. If multiple images exist, produce ONE combined assessment.

Rules:
- Analyze only visible evidence.
- Do not assume unseen damage.
- Do not estimate repair cost.
- If image quality is poor, mention uncertainty.
- Identify suspicious inconsistencies.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.

Required JSON format:
{
  "damageDetected": true,
  "damageArea": "FRONT | REAR | LEFT | RIGHT | MULTIPLE | UNKNOWN",
  "severity": "LOW | MEDIUM | HIGH",
  "confidence": 0,
  "imagesAnalyzed": 0,
  "visibleIndicators": [],
  "suspiciousFlags": [],
  "summary": ""
}

damageArea: FRONT=bonnet/headlights, REAR=trunk/back bumper, LEFT=driver side, RIGHT=passenger side
severity: LOW=cosmetic, MEDIUM=panel damage, HIGH=structural deformation
confidence: 0-100

Total uploaded images: ${imageCount}
`;
  }
}

// ─── Document Verification ───────────────────────────────────────────────────
export class DocumentPromptBuilder {
  static buildDuplicateCheck(docType: string): string {
    return `
You are a document fraud detection specialist for DAICA insurance in Ghana.

You are given TWO ${docType} document images.

Determine if these are the SAME document reused — possibly with minor edits.

Rules:
- Compare document CONTENT, not just visual appearance.
- Look for tampering: altered dates, names, amounts, stamps, signatures.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "isSameContent": true,
  "confidence": 0,
  "tamperedFields": [],
  "suspiciousFlags": [],
  "explanation": ""
}

isSameContent: true if core content is identical even with minor edits
tamperedFields examples: ["accident date appears edited", "stamp appears duplicated"]
suspiciousFlags examples: ["identical background pattern", "matching OB number with different date"]
`;
  }

  static buildPoliceReportValidation(): string {
    return `
You are a document fraud specialist for DAICA insurance in Ghana.

Assess the authenticity of this police report image.

Rules:
- Check for official Ghana Police Service markings.
- Verify OB (Occurrence Book) number format.
- Check for officer signature and stamp.
- Look for signs of editing or tampering.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "isAuthentic": true,
  "confidence": 0,
  "missingElements": [],
  "suspiciousFlags": [],
  "summary": ""
}

missingElements examples: ["no OB number", "no officer signature", "no police station stamp"]
suspiciousFlags examples: ["OB number format invalid", "stamp appears digitally added", "date appears edited"]
`;
  }

  static buildGhanaCardValidation(): string {
    return `
You are an identity document verification specialist for DAICA insurance in Ghana.

Assess whether this Ghana Card (National ID) appears authentic.

Rules:
- Check for Ghana Card standard layout and security features.
- Look for signs of editing or tampering.
- Verify key fields are present and consistent.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "isAuthentic": true,
  "confidence": 0,
  "missingElements": [],
  "suspiciousFlags": [],
  "summary": ""
}

suspiciousFlags examples: ["photo appears digitally replaced", "card number format invalid", "Ghana Card hologram missing"]
`;
  }

  static buildRepairInvoiceValidation(): string {
    return `
You are a motor repair invoice fraud specialist for DAICA insurance in Ghana.

Assess whether this vehicle repair estimate or invoice appears authentic.

Rules:
- Check for garage name, address and contact.
- Verify itemized repair costs are present.
- Look for signs of editing or amount tampering.
- Check for official stamp or signature.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "isAuthentic": true,
  "confidence": 0,
  "missingElements": [],
  "suspiciousFlags": [],
  "summary": ""
}

suspiciousFlags examples: ["amount appears edited", "no garage stamp", "itemized costs missing"]
`;
  }

  static buildDoctorReportValidation(): string {
    return `
You are a medical document fraud specialist for DAICA insurance in Ghana.

Assess whether this doctor's report or medical certificate appears authentic.

Rules:
- Check for hospital/clinic letterhead.
- Verify doctor's signature and stamp.
- Check injury description consistency.
- Look for signs of editing or tampering.
- Return ONLY valid JSON. No markdown. No explanation outside JSON.

{
  "isAuthentic": true,
  "confidence": 0,
  "missingElements": [],
  "suspiciousFlags": [],
  "summary": ""
}

suspiciousFlags examples: ["no hospital letterhead", "doctor signature missing", "date appears altered"]
`;
  }
}
