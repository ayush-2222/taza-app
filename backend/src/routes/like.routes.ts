import { Router } from "express";
import * as likeController from "../controllers/like.controller";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import { likeSchema } from "../utils/validators";

const router = Router();

router.post("/like", validate({ body: likeSchema }), asyncHandler(likeController.toggleLike));

export default router;
