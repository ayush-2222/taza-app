import { api } from "./api";
import { VideoItem } from "@/types/news";

export type AdminVideoPayload = {
  title: string;
  videoUrl?: string;
  thumbnail?: string;
  isLive?: boolean;
  videoFile?: {
    uri: string;
    name?: string;
    type?: string;
  };
};

export const videoService = {
  async getVideos() {
    const response = await api.get<VideoItem[]>("/videos");
    return response.data;
  },

  async getLiveVideos() {
    const response = await api.get<VideoItem[]>("/live");
    return response.data;
  },

  async getArchivedVideos() {
    const response = await api.get<VideoItem[]>("/videos/archive");
    return response.data;
  },

  async createVideo(payload: AdminVideoPayload) {
    const hasFile = Boolean(payload.videoFile?.uri);
    const response = hasFile
      ? await api.post<VideoItem>(
          "/admin/videos",
          (() => {
            const form = new FormData();
            form.append("title", payload.title);
            if (payload.videoUrl) form.append("videoUrl", payload.videoUrl);
            if (payload.thumbnail) form.append("thumbnail", payload.thumbnail);
            if (typeof payload.isLive !== "undefined") form.append("isLive", String(payload.isLive));
            form.append("video", {
              uri: payload.videoFile!.uri,
              name: payload.videoFile!.name ?? "video.mp4",
              type: payload.videoFile!.type ?? "video/mp4"
            } as any);
            return form;
          })(),
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      : await api.post<VideoItem>("/admin/videos", payload);
    return response.data;
  },

  async updateVideo(id: string, payload: Partial<AdminVideoPayload>) {
    const hasFile = Boolean(payload.videoFile?.uri);
    const response = hasFile
      ? await api.patch<VideoItem>(
          `/admin/videos/${id}`,
          (() => {
            const form = new FormData();
            if (payload.title) form.append("title", payload.title);
            if (payload.videoUrl) form.append("videoUrl", payload.videoUrl);
            if (payload.thumbnail) form.append("thumbnail", payload.thumbnail);
            if (typeof payload.isLive !== "undefined") form.append("isLive", String(payload.isLive));
            form.append("video", {
              uri: payload.videoFile!.uri,
              name: payload.videoFile!.name ?? "video.mp4",
              type: payload.videoFile!.type ?? "video/mp4"
            } as any);
            return form;
          })(),
          { headers: { "Content-Type": "multipart/form-data" } }
        )
      : await api.patch<VideoItem>(`/admin/videos/${id}`, payload);
    return response.data;
  },

  async deleteVideo(id: string) {
    const response = await api.delete<{ deleted: boolean }>(`/admin/videos/${id}`);
    return response.data;
  }
};
