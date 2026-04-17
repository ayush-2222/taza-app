import { Request, Response } from "express";
import path from "path";
import { ApiError } from "../utils/ApiError";
import * as videoService from "../services/video.service";

export async function getVideos(_req: Request, res: Response) {
  const videos = await videoService.listVideos();
  res.json(videos);
}

export async function getLiveVideos(_req: Request, res: Response) {
  const liveVideos = await videoService.listLiveVideos();
  res.json(liveVideos);
}

export async function getArchivedVideos(_req: Request, res: Response) {
  const videos = await videoService.listArchivedVideos();
  res.json(videos);
}

export async function createVideo(req: Request, res: Response) {
  const videoUrl = req.file
    ? `/uploads/videos/${path.basename(req.file.path)}`.replace(/\\/g, "/")
    : req.body.videoUrl;

  if (!videoUrl) {
    throw new ApiError(400, "A video file or public video URL is required");
  }

  const video = await videoService.createVideo({
    title: req.body.title,
    videoUrl,
    thumbnail: req.body.thumbnail,
    isLive: req.body.isLive
  });

  res.status(201).json(video);
}

export async function updateVideo(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0] ?? "";
  const videoUrl = req.file
    ? `/uploads/videos/${path.basename(req.file.path)}`.replace(/\\/g, "/")
    : req.body.videoUrl;

  const video = await videoService.updateVideo(id, {
    ...(req.body.title ? { title: req.body.title } : {}),
    ...(videoUrl ? { videoUrl } : {}),
    ...(req.body.thumbnail ? { thumbnail: req.body.thumbnail } : {}),
    ...(typeof req.body.isLive !== "undefined" ? { isLive: req.body.isLive } : {})
  });

  res.json(video);
}

export async function deleteVideo(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : req.params.id?.[0] ?? "";
  const result = await videoService.deleteVideo(id);
  res.json(result);
}
