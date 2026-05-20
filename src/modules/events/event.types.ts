export enum EventType {
  CLAIM_SUBMITTED = "CLAIM_SUBMITTED",
  FRAUD_ANALYZED = "FRAUD_ANALYZED",
  AI_ANALYZED = "AI_ANALYZED",
  DECISION_MADE = "DECISION_MADE",
  NOTIFICATION_SENT = "NOTIFICATION_SENT",
  EVIDENCE_ANALYZED = "EVIDENCE_ANALYZED",
}

export interface DomainEvent<T = any> {
  type: EventType;
  timestamp: Date;
  payload: T;
}
