import { Application } from "@ubio/framework";
import cors from "@koa/cors";
import { InstanceRepository } from "./repositories/InstanceRepository.js";
import { InstanceService } from "./services/InstanceService.js";
import { InstanceRouter } from "./routes/InstanceRouter.js";
import { CleanupConfig } from "./config/CleanupConfig.js";
import { startInstanceCleanup } from "./util/instanceCleanup.js";
import { Metrics } from "./metrics/Metrics.js";
export class App extends Application {
    createGlobalScope() {
        const mesh = super.createGlobalScope();
        mesh.service(InstanceRepository);
        mesh.service(InstanceService);
        mesh.service(CleanupConfig);
        mesh.service(Metrics);
        const instanceRepository = mesh.resolve(InstanceRepository);
        const instanceService = mesh.resolve(InstanceService);
        const cleanupConfig = mesh.resolve(CleanupConfig);
        startInstanceCleanup(instanceService, cleanupConfig);
        return mesh;
    }
    createHttpRequestScope() {
        const mesh = super.createHttpRequestScope();
        mesh.service(InstanceRouter);
        return mesh;
    }
    async beforeStart() {
        this.httpServer.use(cors({
            origin: "http://localhost:3000",
        }));
        await this.httpServer.startServer();
    }
    async afterStop() {
        await this.httpServer.stopServer();
    }
}
//# sourceMappingURL=app.js.map