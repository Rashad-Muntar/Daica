import { FraudAnalysis, FraudRiskLevel } from "./fraudAnalysis.entity";
import { FraudRules } from "./fraudRules";
import { FraudRepository } from "./fraud.repository";
import { Claim } from "../claims/claim.entity";

export class FraudService {
  constructor(private repo: FraudRepository) {}
  async analyzeClaim(claim: Claim): Promise<FraudAnalysis> {
    const result = FraudRules.evaluate(claim);
    let riskLevel = FraudRiskLevel.LOW;

    if (result.score >= 70) {
      riskLevel = FraudRiskLevel.HIGH;
    } else if (result.score >= 40) {
      riskLevel = FraudRiskLevel.MEDIUM;
    }

    const analysis = new FraudAnalysis(
      claim.user_id,
      result.score,
      riskLevel,
      result.reasons,
    );
    this.repo.create(analysis);
    return analysis;
  }
}
