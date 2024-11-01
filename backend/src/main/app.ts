import { Application } from "@ubio/framework";
import cors from "@koa/cors";
import { InstanceRepository } from "./repositories/InstanceRepository.js";
import { InstanceService } from "./services/InstanceService.js";
import { InstanceRouter } from "./routes/InstanceRouter.js";
import { CleanupConfig } from "./config/CleanupConfig.js";
import { startInstanceCleanup } from "./util/instanceCleanup.js";
import { Metrics } from "./metrics/Metrics.js";

export class App extends Application {
  override createGlobalScope() {
    const mesh = super.createGlobalScope();

    // Register services
    mesh.service(InstanceRepository);
    mesh.service(InstanceService);
    mesh.service(CleanupConfig);
    mesh.service(Metrics);

    // Resolve instances for the cleanup utility
    const instanceService = mesh.resolve(InstanceService);
    const cleanupConfig = mesh.resolve(CleanupConfig);

    // Start the instance cleanup utility
    startInstanceCleanup(instanceService, cleanupConfig);

    return mesh;
  }

  override createHttpRequestScope() {
    const mesh = super.createHttpRequestScope();

    // Bind the InstanceRouter in the request scope
    mesh.service(InstanceRouter);

    return mesh;
  }

  override async beforeStart() {
    // Enable CORS
    this.httpServer.use(
      cors({
        origin: "http://localhost:3000",
      })
    );

    await this.httpServer.startServer();
  }

  override async afterStop() {
    await this.httpServer.stopServer();
  }
}
