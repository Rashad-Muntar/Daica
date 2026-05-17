import { isMoreThan10DaysAgo } from "@/utils/dates.utils";
import { Claim } from "../claims/claim.entity";
export class FraudRules {
  static evaluate(claim: Claim) {
    let score = 0;
    const reasons: string[] = [];
    const isMorethan10Days = isMoreThan10DaysAgo(claim.accidentDate)
    if (!claim.images) {
      throw new Error("Claims does not have images");
    }
    if (claim.images.length === 0) {
      score += 30;
      reasons.push("No supporting images provided");
    }

    if (isMorethan10Days) {
      score += 20;
      reasons.push("Accident is more than 10 days");
    }

    if (claim.location.toLowerCase() === "unknown") {
      score += 40;
      reasons.push("Invalid accident location");
    }
    return { score, reasons };
  }
}
