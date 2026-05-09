import { FraudModel } from "./fraud.model"
import type { IFraudAnalysis } from "./fraud.type"

export class FraudRepository{
    async create(analysis: IFraudAnalysis){
        return FraudModel.create({
            claim_id: analysis.claim_id,
            score: analysis.score,
            risk_level: analysis.risk_level,
            reasons: analysis.reasons
        })
    }
}