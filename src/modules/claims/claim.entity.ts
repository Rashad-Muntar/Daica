export class Claim {
  constructor(
    public user_id: string,
    public description: string,
    public location: string,
    public images: string[],
    public status: string,
  ) {}

  updateStatus(status: ClaimStatus) {
    this.status = status;
  }
  isComplete(): boolean {
    return !!(this.description && this.location);
  }
}

export enum ClaimStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  FLAGGED = "FLAGGED",
}
