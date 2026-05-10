import { FraudModel } from "./fraud.model";
import { FraudAnalysis } from "./fraudAnalysis.entity";
export class FraudRepository {
  async create(analysis: FraudAnalysis) {
    return await FraudModel.create({
      claim_id: analysis.claim_id,
      score: analysis.score,
      risk_level: analysis.risk_level,
      reasons: analysis.reasons,
    });
  }
}
