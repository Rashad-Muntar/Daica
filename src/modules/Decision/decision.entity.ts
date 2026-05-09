export enum DecisionType {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  ESCALATE = "ESCALATE",
  REQUEST_MORE_INFO = "REQUEST_MORE_INFO",
}

export class Decision {
  constructor(
    public type: DecisionType,
    public reason: string,
    public metadata: Record<string, unknown> = {},
    public createdAt: Date = new Date(),
  ) {}

  requiresHumanReview(): boolean {
    return this.type === DecisionType.ESCALATE;
  }
}
