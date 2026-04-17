import fs from "fs";
import path from "path";
import { Request } from "express";
import multer, { StorageEngine } from "multer";
import { env } from "../config/env";

function ensureWritableDirectory(candidate: string) {
  fs.mkdirSync(candidate, { recursive: true });
  fs.accessSync(candidate, fs.constants.W_OK);
  return candidate;
}

function resolveUploadRoot() {
  const preferredRoot = path.resolve(process.cwd(), env.UPLOAD_DIR);
  const fallbackRoot = path.resolve(process.cwd(), "uploads");

  try {
    return ensureWritableDirectory(preferredRoot);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EACCES" && (error as NodeJS.ErrnoException).code !== "EROFS") {
      throw error;
    }

    const resolvedFallback = ensureWritableDirectory(fallbackRoot);
    console.warn(`Upload directory "${preferredRoot}" is not writable. Falling back to "${resolvedFallback}".`);
    return resolvedFallback;
  }
}

export const uploadRoot = resolveUploadRoot();

const citizenNewsRoot = path.join(uploadRoot, "citizen-news");
const imageUploadRoot = path.join(uploadRoot, "images");
const videoUploadRoot = path.join(uploadRoot, "videos");

[citizenNewsRoot, imageUploadRoot, videoUploadRoot].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

function createFilename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
  const sanitized = file.originalname.replace(/\s+/g, "-").toLowerCase();
  cb(null, `${Date.now()}-${sanitized}`);
}

const citizenNewsStorage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) =>
    cb(null, citizenNewsRoot),
  filename: createFilename
});

function createDiskStorage(destination: string): StorageEngine {
  return multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, folder: string) => void) =>
      cb(null, destination),
    filename: createFilename
  });
}

export const uploadCitizenNewsImage = multer({
  storage: citizenNewsStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadNewsImage = multer({
  storage: createDiskStorage(imageUploadRoot),
  limits: { fileSize: 8 * 1024 * 1024 }
});

export const uploadVideoFile = multer({
  storage: createDiskStorage(videoUploadRoot),
  limits: { fileSize: 200 * 1024 * 1024 }
});
