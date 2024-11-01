import { config } from "@ubio/framework";

export class CleanupConfig {
  @config({ default: 30000 }) EXPIRATION_AGE!: number;
  @config({ default: 10000 }) CLEANUP_INTERVAL!: number;
}
