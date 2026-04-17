import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export async function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    const userId = req.header("x-user-id");
    if (!userId) {
      throw new ApiError(401, "Admin access requires login");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, isGuest: true }
    });

    if (!user || user.isGuest || user.role !== "admin") {
      throw new ApiError(403, "Admin access denied");
    }

    next();
  } catch (error) {
    next(error);
  }
}

