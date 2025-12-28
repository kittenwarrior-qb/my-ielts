import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Get database URL from environment
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Please add it to your environment variables.');
}

// Create postgres client with serverless-friendly settings
const client = postgres(connectionString, {
  // Serverless functions have limited lifetime, so we need to:
  max: 1, // Limit connections for serverless (each function instance uses 1 connection)
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Timeout connection attempts after 10 seconds
  prepare: false, // Disable prepared statements for better compatibility with connection poolers
});

// Create drizzle instance
export const db = drizzle(client, { schema });
