import { api } from "./api";

export type CitizenNewsPayload = {
  title: string;
  content: string;
  state: string;
  language: string;
};

export const citizenNewsService = {
  async submit(payload: CitizenNewsPayload) {
    const response = await api.post("/citizen-news", payload);
    return response.data;
  }
};
