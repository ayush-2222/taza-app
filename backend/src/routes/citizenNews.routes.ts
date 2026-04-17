import { Router } from "express";
import * as citizenNewsController from "../controllers/citizenNews.controller";
import { uploadCitizenNewsImage } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { citizenNewsSchema } from "../utils/validators";

const router = Router();

router.post(
  "/citizen-news",
  uploadCitizenNewsImage.single("image"),
  validate({ body: citizenNewsSchema }),
  asyncHandler(citizenNewsController.submitCitizenNews),
);

export default router;
