import { FraudRiskLevel } from "./fraudAnalysis.entity";

export interface IFraudAnalysis {
  claim_id: string;
  score: number;
  risk_level: FraudRiskLevel;
  reasons: string[];
}