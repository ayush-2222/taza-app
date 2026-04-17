import http from "http";
import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { initSocket } from "./utils/socket";

async function startServer() {
  await prisma.$connect();

  const server = http.createServer(app);
  initSocket(server);

  server.listen(env.PORT, "0.0.0.0", () => {
    console.log(`Backend listening on 0.0.0.0:${env.PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => process.exit(0));
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});
