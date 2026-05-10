import { Claim } from "../claims/claim.entity";
export class FraudRules {
  static evaluate(claim: Claim) {
    let score = 0;
    const reasons: string[] = [];
    if(!claim.images){
      throw new Error("Claims does not have images")
    }
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
