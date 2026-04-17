import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";
import { ApiError } from "../utils/ApiError";

export async function requireSelfOrAdmin(req: Request, _res: Response, next: NextFunction) {
  try {
    const headerUserId = req.header("x-user-id");
    if (!headerUserId) {
      throw new ApiError(401, "Login required");
    }

    const paramId = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0] ?? "";
    if (headerUserId === paramId) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: headerUserId },
      select: { role: true, isGuest: true }
    });

    if (!user || user.isGuest || user.role !== "admin") {
      throw new ApiError(403, "Not allowed");
    }

    next();
  } catch (error) {
    next(error);
  }
}

