#!/usr/bin/env node
import "reflect-metadata";
import { App } from "../main/app.js";

const app = new App();

try {
  await app.start();
  console.log("Discovery Service is running");
} catch (error: any) {
  app.logger.error("Failed to start", { error });
  process.exit(1);
}
