import { Router } from "express";
import * as newsController from "../controllers/news.controller";
import { locationContextMiddleware } from "../middlewares/locationContext";
import { requireAdmin } from "../middlewares/requireAdmin";
import { scrollFreezeMiddleware } from "../middlewares/scrollFreeze";
import { uploadNewsImage } from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { adminNewsSchema, adminNewsUpdateSchema, newsIdSchema, newsQuerySchema } from "../utils/validators";

const router = Router();

router.get(
  "/news",
  locationContextMiddleware,
  scrollFreezeMiddleware,
  validate({ query: newsQuerySchema }),
  asyncHandler(newsController.getNews),
);
router.get("/news/:id", validate({ params: newsIdSchema }), asyncHandler(newsController.getNewsById));
router.get("/categories", asyncHandler(newsController.getCategories));
router.post(
  "/admin/news",
  requireAdmin,
  uploadNewsImage.single("image"),
  validate({ body: adminNewsSchema }),
  asyncHandler(newsController.createNews),
);
router.patch(
  "/admin/news/:id",
  requireAdmin,
  uploadNewsImage.single("image"),
  validate({ params: newsIdSchema, body: adminNewsUpdateSchema }),
  asyncHandler(newsController.updateNews),
);
router.delete("/admin/news/:id", requireAdmin, validate({ params: newsIdSchema }), asyncHandler(newsController.deleteNews));

export default router;
