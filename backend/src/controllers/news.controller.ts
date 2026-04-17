import { Request, Response } from "express";
import path from "path";
import { ApiError } from "../utils/ApiError";
import * as newsService from "../services/news.service";

export async function getNews(req: Request, res: Response) {
  const payload = await newsService.listNews({
    page: req.query.page ? Number(req.query.page) : undefined,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : undefined,
    category: typeof req.query.category === "string" ? req.query.category : undefined,
    state: typeof req.query.state === "string" ? req.query.state : undefined,
    query: typeof req.query.query === "string" ? req.query.query : undefined,
    locationState: req.locationContext?.state,
    freezeFeed: req.sessionFreeze?.freezeFeed
  });

  res.json(payload);
}

export async function getNewsById(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0] ?? "";
  const news = await newsService.getNewsById(id);
  if (!news) {
    throw new ApiError(404, "News item not found");
  }

  const { _count, ...item } = news;
  res.json({
    ...item,
    likesCount: _count.likes
  });
}

export async function getCategories(_req: Request, res: Response) {
  const categories = await newsService.listCategories();
  res.json(categories);
}

export async function createNews(req: Request, res: Response) {
  const imageUrl = req.file
    ? `/uploads/images/${path.basename(req.file.path)}`.replace(/\\/g, "/")
    : req.body.imageUrl;

  const news = await newsService.createNews({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    category: req.body.category,
    state: req.body.state,
    imageUrl
  });

  res.status(201).json(news);
}

export async function updateNews(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0] ?? "";
  const imageUrl = req.file
    ? `/uploads/images/${path.basename(req.file.path)}`.replace(/\\/g, "/")
    : req.body.imageUrl;

  const news = await newsService.updateNews(id, {
    ...(req.body.title ? { title: req.body.title } : {}),
    ...(req.body.description ? { description: req.body.description } : {}),
    ...(req.body.content ? { content: req.body.content } : {}),
    ...(req.body.category ? { category: req.body.category } : {}),
    ...(req.body.state ? { state: req.body.state } : {}),
    ...(imageUrl ? { imageUrl } : {})
  });

  res.json(news);
}

export async function deleteNews(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0] ?? "";
  const result = await newsService.deleteNews(id);
  res.json(result);
}
