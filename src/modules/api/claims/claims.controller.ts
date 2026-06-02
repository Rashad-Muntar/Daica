import type { Request, Response } from "express";
import { ClaimService } from "@/modules/claims/claim.service";
import { CloudinaryService } from "@/integrations/cloudinary/cloudinary.service";

export class ClaimController {
  constructor(
    private claimService: ClaimService,
    private cloudinaryService: CloudinaryService,
  ) {}


  createClaim = async (req: Request, res: Response) => {
    // console.log("Received claim submission:", req.body); // ← log incoming request
  const { callbackUrl, ...data } = req.body;

  const extractedData = data.data
  if (!extractedData.user_id || !extractedData.policyNumber || !extractedData.accidentDate || !extractedData.location) {
    res.status(400).json({ error: "user_id, policyNumber, accidentDate and location are required" });
    return;
  }

  if (!callbackUrl) {
    res.status(400).json({ error: "callbackUrl is required" });
    return;
  }

  // Basic URL validation
  try {
    new URL(callbackUrl);
  } catch {
    res.status(400).json({ error: "callbackUrl must be a valid URL" });
    return;
  }

  await this.claimService.createClaim(
    { ...extractedData, status: "PENDING" },
    callbackUrl, // ← pass callback URL
  );

  // ← return 202 immediately — don't wait for pipeline
  res.status(202).json({
    success: true,
    message: "Claim received and is being processed. Results will be sent to your callbackUrl.",
    data: {
      callbackUrl,
      status:      "PROCESSING",
    },
  });
};

  // POST /claims/images
  uploadDamageImages = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: "At least one image is required" });
      return;
    }

    const base64Files = files.map((f) => {
      const mime = f.mimetype;
      return `data:${mime};base64,${f.buffer.toString("base64")}`;
    });

    const urls = await this.cloudinaryService.uploadImages(base64Files);
    res.status(200).json({ success: true, data: { urls } });
  };

  // POST /claims/police-report
  uploadPoliceReport = async (req: Request, res: Response): Promise<void> => {
    const file = req.file as Express.Multer.File;

    if (!file) {
      res.status(400).json({ error: "Police report file is required" });
      return;
    }

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";
    const url = await this.cloudinaryService["client"].upload(
      base64,
      resourceType,
    );

    res.status(200).json({ success: true, data: { url } });
  };

  // POST /claims/repair-estimate
  uploadRepairEstimate = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res
        .status(400)
        .json({ error: "At least one repair estimate file is required" });
      return;
    }

    const uploaded = await Promise.all(
      files.map((f) => {
        const base64 = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
        const resourceType = f.mimetype === "application/pdf" ? "raw" : "image";
        return this.cloudinaryService["client"].upload(base64, resourceType);
      }),
    );

    res.status(200).json({ success: true, data: { urls: uploaded } });
  };

  // POST /claims/medical-report
  uploadMedicalReport = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res
        .status(400)
        .json({ error: "At least one medical report file is required" });
      return;
    }

    const uploaded = await Promise.all(
      files.map((f) => {
        const base64 = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
        const resourceType = f.mimetype === "application/pdf" ? "raw" : "image";
        return this.cloudinaryService["client"].upload(base64, resourceType);
      }),
    );

    res.status(200).json({ success: true, data: { urls: uploaded } });
  };
}
