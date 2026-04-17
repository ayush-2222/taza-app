import fs from "fs";
import path from "path";
import multer from "multer";
import { env } from "../config/env";

const citizenNewsRoot = path.resolve(process.cwd(), env.UPLOAD_DIR, "citizen-news");
const imageUploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR, "images");
const videoUploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR, "videos");

[citizenNewsRoot, imageUploadRoot, videoUploadRoot].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

const citizenNewsStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, citizenNewsRoot),
  filename: (_req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${sanitized}`);
  }
});

function createDiskStorage(destination: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, destination),
    filename: (_req, file, cb) => {
      const sanitized = file.originalname.replace(/\s+/g, "-").toLowerCase();
      cb(null, `${Date.now()}-${sanitized}`);
    }
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
