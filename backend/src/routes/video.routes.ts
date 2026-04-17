import { Router } from "express";
import * as videoController from "../controllers/video.controller";
import { requireAdmin } from "../middlewares/requireAdmin";
import { uploadVideoFile } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { adminVideoSchema, adminVideoUpdateSchema, videoIdSchema } from "../utils/validators";

const router = Router();

router.get("/videos", asyncHandler(videoController.getVideos));
router.get("/live", asyncHandler(videoController.getLiveVideos));
router.get("/videos/archive", asyncHandler(videoController.getArchivedVideos));
router.post(
  "/admin/videos",
  requireAdmin,
  uploadVideoFile.single("video"),
  validate({ body: adminVideoSchema }),
  asyncHandler(videoController.createVideo),
);
router.patch(
  "/admin/videos/:id",
  requireAdmin,
  uploadVideoFile.single("video"),
  validate({ params: videoIdSchema, body: adminVideoUpdateSchema }),
  asyncHandler(videoController.updateVideo),
);
router.delete("/admin/videos/:id", requireAdmin, validate({ params: videoIdSchema }), asyncHandler(videoController.deleteVideo));

export default router;
