import { Claim } from "./claim.entity";
import type { ClaimDocument } from "./claim.model";

export class ClaimMapper {
  static toEntity(document: ClaimDocument): Claim {
    return new Claim(
      document.user_id,
      document.location,
      document.policyNumber,
      document.accidentDate,
      document.images,
      document.status,
    );
  }
}
