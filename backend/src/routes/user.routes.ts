import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { requireAdmin } from "../middlewares/requireAdmin";
import { requireSelfOrAdmin } from "../middlewares/requireSelfOrAdmin";
import { validate } from "../middlewares/validate";
import { asyncHandler } from "../utils/asyncHandler";
import {
  authLoginSchema,
  authSignupSchema,
  locationSchema,
  passwordUpdateSchema,
  profileUpdateSchema,
  userIdSchema
} from "../utils/validators";

const router = Router();

router.post("/auth/signup", validate({ body: authSignupSchema }), asyncHandler(userController.signup));
router.post("/auth/login", validate({ body: authLoginSchema }), asyncHandler(userController.login));
router.get("/admin/users", requireAdmin, asyncHandler(userController.getRegisteredUsers));
router.post("/users/location", validate({ body: locationSchema }), asyncHandler(userController.saveLocation));
router.get("/users/profile/:id", validate({ params: userIdSchema }), asyncHandler(userController.getProfile));
router.patch(
  "/users/profile/:id",
  requireSelfOrAdmin,
  validate({ params: userIdSchema, body: profileUpdateSchema }),
  asyncHandler(userController.updateProfile),
);
router.patch(
  "/users/password/:id",
  requireSelfOrAdmin,
  validate({ params: userIdSchema, body: passwordUpdateSchema }),
  asyncHandler(userController.updatePassword)
);

export default router;
