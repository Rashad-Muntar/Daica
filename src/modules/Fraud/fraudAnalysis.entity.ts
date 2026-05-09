export enum FraudRiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class FraudAnalysis {
  constructor(
    public claim_id: string,
    public score: number,
    public risk_level: FraudRiskLevel,
    public reasons: string[],
  ) {}

  isHighRisk(): boolean {
    return this.risk_level === FraudRiskLevel.HIGH;
  }
}
