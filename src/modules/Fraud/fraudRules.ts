import { isMoreThan10DaysAgo } from "@/utils/dates.utils";
import { Claim } from "../claims/claim.entity";
import { ClaimRepository } from "../claims/claim.repository";
import { DocumentFraudService } from "./docsFraud.service";

export interface FraudEvaluationResult {
  score: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reasons: string[];
  documentFlags: DocumentFlag[];
}

export interface DocumentFlag {
  docType: string;
  isReused: boolean;
  isAuthentic: boolean;
  similarClaimId?: string | undefined;
  suspiciousFlags: string[];
  missingElements: string[];
  explanation: string;
}

export class FraudRules {
  constructor(
    private documentFraudService: DocumentFraudService,
    private claimRepo: ClaimRepository,
  ) {}

  async evaluate(
    claim: Claim,
    claimId?: string,
  ): Promise<FraudEvaluationResult> {
    let score = 0;
    const reasons: string[] = [];
    const documentFlags: DocumentFlag[] = [];

    if (!claim.vehicleImages) throw new Error("Claim does not have images");

    // ─── 1. CLAIM TIMING ─────────────────────────────────────────────────────

    // Delayed reporting — Section 2A
    if (isMoreThan10DaysAgo(claim.accidentDate)) {
      score += 20;
      reasons.push("Accident reported more than 10 days after occurrence");
    }

    // Accident happened at night — Section 2B fraud hotspot
    if (claim.accidentTime) {
      const hour = parseInt(claim.accidentTime.split(":")[0] ?? "12");
      if (hour >= 22 || hour <= 5) {
        score += 10;
        reasons.push(
          "Accident reported during high-risk night hours (10PM–5AM)",
        );
      }
    }

    // Multiple claims from same user — Section 2C
    const previousClaims = await this.claimRepo.countByUserId(
      claim.user_id,
      claimId,
    );
    if (previousClaims >= 3) {
      score += 20;
      reasons.push(`Claimant has ${previousClaims} previous claims on record`);
    } else if (previousClaims >= 1) {
      score += 10;
      reasons.push(
        `Claimant has ${previousClaims} previous claim(s) on record`,
      );
    }

    // ─── 2. EVIDENCE COMPLETENESS ────────────────────────────────────────────

    // No damage images
    if (claim.vehicleImages.length === 0) {
      score += 30;
      reasons.push("No supporting damage images provided");
    }

    // No accident description — Section 3A
    if (!claim.accidentDescription) {
      score += 15;
      reasons.push("No accident description provided");
    }

    // ─── 3. LOCATION ─────────────────────────────────────────────────────────

    if (!claim.location || claim.location.toLowerCase() === "unknown") {
      score += 40;
      reasons.push("Invalid or missing accident location");
    }

    // ─── 4. BLAME & THIRD PARTY CONSISTENCY ──────────────────────────────────

    if (!claim.driverToBlame && !claim.otherPersonToBlame) {
      score += 10;
      reasons.push("No party assigned blame for the accident");
    }

    // Other person blamed but no details — Section 3B
    if (claim.otherPersonToBlame && !claim.otherPersonDetails) {
      score += 20;
      reasons.push("Other person blamed but no details provided");
    }

    // ─── 5. VEHICLE DAMAGE — Section 4 ───────────────────────────────────────

    if (!claim.vehicleDamageDescription) {
      score += 15;
      reasons.push("No vehicle damage description provided");
    }

    // No repair estimate — possible inflation later (Section 6A)
    if (!claim.estimatedRepairCost || claim.estimatedRepairCost === 0) {
      score += 10;
      reasons.push("No repair cost estimate provided");
    }

    // ─── 6. OTHER VEHICLE ────────────────────────────────────────────────────

    if (!claim.otherVehicleRegNumber && !claim.otherVehicleMake) {
      score += 10;
      reasons.push("No details of other vehicle involved");
    }

    // ─── 7. POLICE REPORT — Section 8 ────────────────────────────────────────

    if (claim.policeWitnessed && !claim.policeOfficerName) {
      score += 15;
      reasons.push(
        "Police said to have witnessed but no officer details given",
      );
    }

    if (
      (claim.policeWitnessed || claim.policeTookParticulars) &&
      !claim.policeReportUrl
    ) {
      score += 15;
      reasons.push("Police involved but no police report document uploaded");
    }

    // ─── 8. WITNESSES ────────────────────────────────────────────────────────

    if (!claim.witness1 && !claim.witness2) {
      score += 5;
      reasons.push("No witnesses provided");
    }

    // ─── 9. INJURY PARAMETERS — Section 7 ────────────────────────────────────

    if (
      claim.injuredPersonDetails &&
      claim.injuredPersonDetails.length > 0 &&
      !claim.doctorReportUrl
    ) {
      score += 15;
      reasons.push("Injured persons reported but no doctor's report uploaded");
    }

    const hasSevereInjury = claim.injuredPersonDetails?.some(
      (p) => p.severity?.toLowerCase() === "severe",
    );
    if (hasSevereInjury && !claim.doctorReportUrl) {
      score += 20;
      reasons.push(
        "Severe injuries reported but no medical documentation provided",
      );
    }

    // ─── 10. IDENTITY — Section 1D ────────────────────────────────────────────

    if (!claim.ghanaCardUrl) {
      score += 10;
      reasons.push("No Ghana Card uploaded for identity verification");
    }

    // ─── 11. DOCUMENT FRAUD CHECKS — Section 9C ──────────────────────────────

    const documentsToCheck: Array<{
      url: string | undefined;
      type: Parameters<DocumentFraudService["checkDocument"]>[1];
      label: string;
      reusedScore: number;
      inauthenticScore: number;
    }> = [
      {
        url: claim.policeReportUrl,
        type: "police_report",
        label: "Police Report",
        reusedScore: 40,
        inauthenticScore: 35,
      },
      {
        url: claim.repairInvoiceUrl,
        type: "repair_invoice",
        label: "Repair Invoice",
        reusedScore: 35,
        inauthenticScore: 25,
      },
      {
        url: claim.ghanaCardUrl,
        type: "ghana_card",
        label: "Ghana Card",
        reusedScore: 50,
        inauthenticScore: 45,
      },
      {
        url: claim.doctorReportUrl,
        type: "doctor_report",
        label: "Doctor Report",
        reusedScore: 35,
        inauthenticScore: 25,
      },
    ];

    //     // Run all document checks in parallel
    const docResults = await Promise.allSettled(
      documentsToCheck.map(async (doc) => {
        // console.log("DOCUMENT CHECK:", doc.type, doc.url);
        if (!doc.url) return null;

        const result = await this.documentFraudService.checkDocument(
          doc.url,
          doc.type,
          claimId,
        );
        console.log("CHECK RESULT:", doc.type, result);

        return { doc, result };
      }),
    );

    for (const settled of docResults) {
      if (settled.status === "rejected" || !settled.value) continue;
      const { doc, result } = settled.value;

      const flag: DocumentFlag = {
        docType: doc.label,
        isReused: result.isReused,
        isAuthentic: result.isAuthentic,
        similarClaimId: result.similarClaimId,
        suspiciousFlags: result.suspiciousFlags,
        missingElements: result.missingElements,
        explanation: result.explanation,
      };

      documentFlags.push(flag);

      // Reused document — high fraud signal
      if (result.isReused) {
        score += doc.reusedScore;
        reasons.push(
          `${doc.label} was reused from a previous claim (Claim ID: ${result.similarClaimId})`,
        );
      }

      // Inauthentic document
      if (!result.isAuthentic) {
        score += doc.inauthenticScore;
        reasons.push(
          `${doc.label} failed authenticity check: ${result.explanation}`,
        );
      }

      // Suspicious flags on the document
      if (result.suspiciousFlags.length > 0) {
        score += result.suspiciousFlags.length * 5;
        reasons.push(
          `${doc.label} has suspicious indicators: ${result.suspiciousFlags.join(", ")}`,
        );
      }

      // Missing required elements
      if (result.missingElements.length > 0) {
        score += result.missingElements.length * 3;
        reasons.push(
          `${doc.label} is missing: ${result.missingElements.join(", ")}`,
        );
      }
    }

    // Check damage images for reuse

    for (const settled of docResults) {
      if (settled.status === "rejected" || !settled.value) continue;
      const { doc, result } = settled.value;

      // ← always push the flag, even if clean
      const flag: DocumentFlag = {
        docType: doc.label,
        isReused: result.isReused,
        isAuthentic: result.isAuthentic,
        similarClaimId: result.similarClaimId,
        suspiciousFlags: result.suspiciousFlags,
        missingElements: result.missingElements,
        explanation: result.explanation,
      };
      documentFlags.push(flag);

      if (result.isReused) {
        score += doc.reusedScore;
        reasons.push(
          `${doc.label} was reused from a previous claim (Claim ID: ${result.similarClaimId})`,
        );
      }

      if (!result.isAuthentic) {
        score += doc.inauthenticScore;
        reasons.push(
          `${doc.label} failed authenticity check: ${result.explanation}`,
        );
      }

      if (result.suspiciousFlags.length > 0) {
        score += result.suspiciousFlags.length * 5;
        reasons.push(
          `${doc.label} has suspicious indicators: ${result.suspiciousFlags.join(", ")}`,
        );
      }

      if (result.missingElements.length > 0) {
        score += result.missingElements.length * 3;
        reasons.push(
          `${doc.label} is missing: ${result.missingElements.join(", ")}`,
        );
      }
    }
    const imageChecks = await Promise.allSettled(
      claim.vehicleImages.map((url) =>
        this.documentFraudService.checkDocument(url, "damage_image", claimId),
      ),
    );

    let reusedImageCount = 0;
    for (const settled of imageChecks) {
      if (settled.status === "fulfilled" && settled.value.isReused) {
        reusedImageCount++;
      }
    }

    if (reusedImageCount > 0) {
      score += 30 * reusedImageCount;
      reasons.push(
        `${reusedImageCount} damage image(s) were reused from previous claims`,
      );
    }

    // ─── 12. FINAL RISK LEVEL ─────────────────────────────────────────────────

    const cappedScore = Math.min(score, 100);
    const riskLevel: "LOW" | "MEDIUM" | "HIGH" =
      cappedScore >= 61 ? "HIGH" : cappedScore >= 31 ? "MEDIUM" : "LOW";

    const result = {
      score: cappedScore,
      riskLevel,
      reasons,
      documentFlags,
    };
    console.log(result);
    return result;
  }
}
