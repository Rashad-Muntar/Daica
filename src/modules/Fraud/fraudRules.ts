import { isMoreThan10DaysAgo } from "@/utils/dates.utils";
import { Claim } from "../claims/claim.entity";

export class FraudRules {
  static evaluate(claim: Claim) {
    let score = 0;
    const reasons: string[] = [];

    if (!claim.images) throw new Error("Claim does not have images");

    // Images
    if (claim.images.length === 0) {
      score += 30;
      reasons.push("No supporting images provided");
    }

    // Accident date
    if (isMoreThan10DaysAgo(claim.accidentDate)) {
      score += 20;
      reasons.push("Accident reported more than 10 days after occurrence");
    }

    // Location
    if (!claim.location || claim.location.toLowerCase() === "unknown") {
      score += 40;
      reasons.push("Invalid or missing accident location");
    }

    // No description of accident
    if (!claim.accidentDescription) {
      score += 15;
      reasons.push("No accident description provided");
    }

    // No blame assigned — suspicious if neither box ticked
    if (!claim.driverToBlame && !claim.otherPersonToBlame) {
      score += 10;
      reasons.push("No party assigned blame for the accident");
    }

    // Other person blamed but no details given
    if (claim.otherPersonToBlame && !claim.otherPersonDetails) {
      score += 20;
      reasons.push("Other person blamed but no details provided");
    }

    // No vehicle damage description
    if (!claim.vehicleDamageDescription) {
      score += 15;
      reasons.push("No vehicle damage description provided");
    }

    // No repair estimate
    if (!claim.estimatedRepairCost || claim.estimatedRepairCost === 0) {
      score += 10;
      reasons.push("No repair cost estimate provided");
    }

    // Other vehicle involved but no details
    if (!claim.otherVehicleRegNumber && !claim.otherVehicleMake) {
      score += 10;
      reasons.push("No details of other vehicle involved");
    }

    // Police involved but no officer details
    if (claim.policeWitnessed && !claim.policeOfficerName) {
      score += 15;
      reasons.push("Police said to have witnessed but no officer details given");
    }

    // No witnesses at all
    if (!claim.witness1 && !claim.witness2) {
      score += 5;
      reasons.push("No witnesses provided");
    }

    return { score, reasons };
  }
}