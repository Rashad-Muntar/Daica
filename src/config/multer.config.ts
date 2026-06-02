import multer from "multer";
import type { Request, Response, NextFunction } from "express";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];
const ALLOWED_DOCUMENT_TYPES = [...ALLOWED_IMAGE_TYPES, "application/pdf"]; // no webp

const storage = multer.memoryStorage();

const imageFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: jpeg, jpg, png, gif`));
  }
};

const documentFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed: jpeg, jpg, png, gif, pdf. WebP is not accepted.`,
      ),
    );
  }
};

// Single image upload (e.g. Ghana card)
export const uploadSingleImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("file");

// Multiple image upload (e.g. damage images)
export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
}).array("files", 10);

// Single document — images + PDF, no webp (police report)
export const uploadSingleDocument = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for PDFs
}).single("file");

// Multiple documents — images + PDF, no webp (repair estimate, medical)
export const uploadMultipleDocuments = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
}).array("files", 5);

// Global multer error handler
export const handleUploadError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File too large. Maximum size is 10MB." });
      return;
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      res.status(400).json({ error: "Too many files. Maximum is 10 files." });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  next();
};
