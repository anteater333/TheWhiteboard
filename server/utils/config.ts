import Dotenv from "dotenv";

Dotenv.config();

export const { PORT = 3000, NODE_ENV = "production" } = process.env;
