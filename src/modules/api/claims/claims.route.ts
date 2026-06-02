import { Router } from "express";
import { ClaimController } from "./claims.controller";
import {
  uploadMultipleImages,
  uploadSingleDocument,
  uploadMultipleDocuments,
  handleUploadError,
} from "@/config/multer.config";

export function createClaimRouter(controller: ClaimController): Router {
  const router = Router();

  // Create claim + get full analysis result
  router.post("/", controller.createClaim);

  // Upload damage images (multiple, images only)
  router.post(
    "/images",
    uploadMultipleImages,
    handleUploadError,
    controller.uploadDamageImages,
  );

  // Upload police report (single, image or PDF, no webp)
  router.post(
    "/police-report",
    uploadSingleDocument,
    handleUploadError,
    controller.uploadPoliceReport,
  );

  // Upload repair estimate (multiple, image or PDF, no webp)
  router.post(
    "/repair-estimate",
    uploadMultipleDocuments,
    handleUploadError,
    controller.uploadRepairEstimate,
  );

  // Upload medical report (multiple, image or PDF, no webp)
  router.post(
    "/medical-report",
    uploadMultipleDocuments,
    handleUploadError,
    controller.uploadMedicalReport,
  );

  return router;
}
