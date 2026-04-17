import { Request, Response } from "express";
import path from "path";
import * as citizenNewsService from "../services/citizenNews.service";

export async function submitCitizenNews(req: Request, res: Response) {
  const imageUrl = req.file
    ? `/${path.basename(path.dirname(req.file.path))}/${req.file.filename}`.replace(/\\/g, "/")
    : undefined;

  const news = await citizenNewsService.createCitizenNews({
    title: req.body.title,
    content: req.body.content,
    state: req.body.state,
    language: req.body.language,
    imageUrl: imageUrl ? `/uploads${imageUrl}` : undefined
  });

  res.status(201).json(news);
}
