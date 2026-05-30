import { Claim } from "./claim.entity";
import { ClaimRepository } from "./claim.repository";
import { UnprocessableEntityError } from "@/utils/errors";
import type { IClaim } from "./claim.type";
import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";

export class ClaimService {
  constructor(
    private repo: ClaimRepository,
    private eventBus: EventBus,
  ) {}

  async createClaim(data: IClaim) {
    if (!data.images)  throw new Error("Images are required");
    if (!data.status)  throw new Error("Status is required");

    const claim = new Claim(
      data.user_id,
      data.location,
      data.policyNumber,
      data.accidentDate,
      data.accidentTime ?? "",
      data.images,
      data.status,
      data.driverToBlame ?? false,
      data.otherPersonToBlame ?? false,
      data.otherPersonDetails ?? "",
      data.accidentDescription ?? "",
      data.lightsOnAtNight ?? "",
      data.vehicleDamageDescription ?? "",
      data.vehicleLocation ?? "",
      data.nearestRepairer ?? "",
      data.estimatedRepairCost ?? 0,
      data.repairInvoiceUrl ?? "",
      data.injuredPersonDetails ?? [],
      data.doctorReportUrl ?? "",
      data.otherVehicleRegNumber ?? "",
      data.otherVehicleMake ?? "",
      data.otherVehicleOwnerAddress ?? "",
      data.otherVehicleInsurerDetails ?? "",
      data.policeWitnessed ?? false,
      data.policeTookParticulars ?? false,
      data.policeOfficerName ?? "",
      data.policeStation ?? "",
      data.policeReportUrl ?? "",
      data.witness1 ?? "",
      data.witness2 ?? "",
      data.ghanaCardUrl ?? "",
      data.imageHashes ?? [],
      data.policeReportHash ?? "",
      data.repairInvoiceHash ?? "",
      data.ghanaCardHash ?? "",
      data.doctorReportHash ?? "",
    );

    if (!claim.isComplete()) {
      throw new UnprocessableEntityError("Claim is incomplete");
    }

    const savedClaim = await this.repo.create(claim);
    this.eventBus.publish({
      type: EventType.CLAIM_SUBMITTED,
      timestamp: new Date(),
      payload: claim,
    });

    return savedClaim;
  }
}