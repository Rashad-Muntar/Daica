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
    public confidence: number,
    public explainability: string[],
  ) {}
}
