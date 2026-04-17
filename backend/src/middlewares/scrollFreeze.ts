import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { env } from "../config/env";

const sessionHits = new Map<string, number>();

export function scrollFreezeMiddleware(req: Request, _res: Response, next: NextFunction) {
  const sessionId =
    req.header("x-session-id") ??
    crypto.createHash("sha1").update(`${req.ip}-${req.headers["user-agent"] ?? "unknown"}`).digest("hex");

  const nextCount = (sessionHits.get(sessionId) ?? 0) + 1;
  sessionHits.set(sessionId, nextCount);

  req.sessionFreeze = {
    sessionId,
    requestCount: nextCount,
    freezeFeed: nextCount > env.SCROLL_FREEZE_LIMIT
  };

  next();
}
