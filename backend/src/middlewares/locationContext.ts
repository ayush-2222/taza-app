import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

export async function locationContextMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const userIdHeader = req.header("x-user-id");
    const stateHeader = req.header("x-user-state") ?? req.query.state;
    const cityHeader = req.header("x-user-city") ?? req.query.city;

    let user = null;
    if (userIdHeader) {
      user = await prisma.user.findUnique({
        where: { id: userIdHeader },
        select: { id: true, city: true, state: true, isGuest: true }
      });
    }

    req.locationContext = {
      city: typeof cityHeader === "string" ? cityHeader : user?.city ?? undefined,
      state: typeof stateHeader === "string" ? stateHeader : user?.state ?? undefined,
      user
    };

    next();
  } catch (error) {
    next(error);
  }
}
