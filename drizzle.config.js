import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/backend/database/schema/index.ts",
  out: "./src/backend/database/migrations",

  dialect: "sqlite",
  driver: "expo",
});
