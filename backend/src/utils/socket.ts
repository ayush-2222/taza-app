import type { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server | null = null;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    socket.emit("connection:ready", { message: "Realtime channel connected" });
  });

  return io;
}

export function getSocket() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
}

