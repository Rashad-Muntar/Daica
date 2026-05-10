import type { IClaim } from "../claims/claim.type";
export class FraudRules {
  static evaluate(claim: IClaim) {
    let score = 0;
    const reasons: string[] = [];
    if (claim.images.length === 0) {
      score += 30;
      reasons.push("No supporting images provided");
    }

    if (claim.description.length < 20) {
      score += 20;
      reasons.push("Very short accident description");
    }

    if (claim.location.toLowerCase() === "unknown") {
      score += 40;
      reasons.push("Invalid accident location");
    }
    return { score, reasons };
  }
}
