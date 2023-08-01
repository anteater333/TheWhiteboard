import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var client: PrismaClient | undefined;
}

const dbClient = global.client || new PrismaClient();

if (process.env.NODE_ENV === "development") global.client = dbClient;

export default dbClient;
