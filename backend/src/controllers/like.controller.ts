import { Request, Response } from "express";
import * as likeService from "../services/like.service";

export async function toggleLike(req: Request, res: Response) {
  const result = await likeService.toggleLike(req.body.userId, req.body.newsId);
  res.json(result);
}
