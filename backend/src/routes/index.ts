import { Router } from "express";
import newsRoutes from "./news.routes";
import videoRoutes from "./video.routes";
import citizenNewsRoutes from "./citizenNews.routes";
import likeRoutes from "./like.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use(newsRoutes);
router.use(videoRoutes);
router.use(citizenNewsRoutes);
router.use(likeRoutes);
router.use(userRoutes);

export default router;

