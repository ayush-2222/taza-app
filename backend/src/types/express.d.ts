import type { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      locationContext?: {
        city?: string;
        state?: string;
        user?: Pick<User, "id" | "city" | "state" | "isGuest"> | null;
      };
      sessionFreeze?: {
        freezeFeed: boolean;
        requestCount: number;
        sessionId: string;
      };
    }
  }
}

export {};

