export class Claim {
  constructor(
    public user_id: string,
    public location: string,
    public policyNumber: string,
    public accidentDate: Date,
    public images: string[],
    public status: string,
  ) {}

  updateStatus(status: ClaimStatus) {
    this.status = status;
  }
  isComplete(): boolean {
    return !!this.location;
  }
}

export enum ClaimStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
}
