import { Request, Response } from "express";

export function healthcheck(_req: Request, res: Response) {
  res.json({ status: "ok" });
}

