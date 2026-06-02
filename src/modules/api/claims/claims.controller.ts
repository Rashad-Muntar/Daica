import type { Request, Response } from "express";
import { ClaimService } from "@/modules/claims/claim.service";
import { EventBus } from "@/modules/events/eventBus";
import { CloudinaryService } from "@/integrations/cloudinary/cloudinary.service";
import { EventType } from "@/modules/events/event.types";


export class ClaimController {
  constructor(
    private claimService: ClaimService,
    private cloudinaryService: CloudinaryService,
    private eventBus: EventBus,
  ) {}

  // POST /claims
  createClaim = async (req: Request, res: Response) => {
    const data = req.body;

    if (!data.user_id || !data.policyNumber || !data.accidentDate || !data.location) {
      res.status(400).json({ error: "user_id, policyNumber, accidentDate and location are required" });
      return;
    }

    const result = await new Promise<any>((resolve, reject) => {
    
      const unsubscribe = this.eventBus.subscribeOnce(
        EventType.DECISION_MADE,
        (event) => resolve(event.payload),
      );

      this.claimService.createClaim({ ...data, status: "PENDING" })
        .catch((err) => {
          unsubscribe();
          reject(err);
        });
    });
    console.log("Final claim processing result:", result);
    res.status(201).json({ success: true });

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
    const url = await this.cloudinaryService["client"].upload(base64, resourceType);

    res.status(200).json({ success: true, data: { url } });
  };

  // POST /claims/repair-estimate
  uploadRepairEstimate = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: "At least one repair estimate file is required" });
      return;
    }

    const uploaded = await Promise.all(
      files.map((f) => {
        const base64 = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
        const resourceType = f.mimetype === "application/pdf" ? "raw" : "image";
        return this.cloudinaryService["client"].upload(base64, resourceType);
      })
    );

    res.status(200).json({ success: true, data: { urls: uploaded } });
  };

  // POST /claims/medical-report
  uploadMedicalReport = async (req: Request, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400).json({ error: "At least one medical report file is required" });
      return;
    }

    const uploaded = await Promise.all(
      files.map((f) => {
        const base64 = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;
        const resourceType = f.mimetype === "application/pdf" ? "raw" : "image";
        return this.cloudinaryService["client"].upload(base64, resourceType);
      })
    );

    res.status(200).json({ success: true, data: { urls: uploaded } });
  };
}