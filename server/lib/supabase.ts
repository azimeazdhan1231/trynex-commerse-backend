import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Use the DATABASE_URL from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const client = postgres(connectionString, { 
  max: 1,
  ssl: { rejectUnauthorized: false },
  connect_timeout: 60,
  idle_timeout: 30,
  max_lifetime: 60 * 30
});

export const db = drizzle(client, { schema });
