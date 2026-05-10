import { Claim } from "./claim.entity";
import type { ClaimDocument } from "./claim.model";

export class ClaimMapper {
  static toEntity(document: ClaimDocument): Claim {
    return new Claim(
      document.user_id,
      document.description,
      document.location,
      document.images,
      document.status,
    );
  }
}
