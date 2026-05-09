export enum FraudRiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class FraudAnalysis {
  constructor(
    public claimId: string,
    public score: number,
    public riskLevel: FraudRiskLevel,
    public reasons: string[],
    public createdAt: Date = new Date()
  ) {}

  isHighRisk(): boolean {
    return this.riskLevel === FraudRiskLevel.HIGH;
  }
}