import { Claim } from "./claim.entity";
import { ClaimRepository } from "./claim.repository";
import { UnprocessableEntityError } from "@/utils/errors";
import { DocumentFraudService } from "../fraud/docsFraud.service";
import type { IClaim } from "./claim.type";
import { EventBus } from "../events/eventBus";
import { EventType } from "../events/event.types";

export class ClaimService {
  constructor(
    private repo: ClaimRepository,
    private eventBus: EventBus,
    private documentFraudService: DocumentFraudService,
  ) {}

  async createClaim(data: IClaim) {
    if (!data.vehicleImages) throw new Error("Images are required");
    if (!data.status) throw new Error("Status is required");
    const hashes = await this.documentFraudService.generateDocumentHashes({
      vehicleImages: data.vehicleImages || [],
      policeReportUrl: data.policeReportUrl || "",
      repairInvoiceUrl: data.repairInvoiceUrl || "",
      doctorReportUrl: data.doctorReportUrl || "",
      ghanaCardUrl: data.ghanaCardUrl || "",
    });
    const claim = new Claim(
      data.user_id,
      data.location,
      data.policyNumber,
      data.accidentDate,
      data.accidentTime ?? "",
      data.vehicleImages,
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
      hashes.imageHashes,
      hashes.policeReportHash,
      hashes.repairInvoiceHash,
      hashes.ghanaCardHash,
      hashes.doctorReportHash,

      hashes.policeReportPHash,
      hashes.repairInvoicePHash,
      hashes.ghanaCardPHash,
      hashes.doctorReportPHash,

      hashes.imagePHashes,
    );

    // console.log(claim)

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
