import { Application } from "@ubio/framework";
export declare class App extends Application {
    createGlobalScope(): import("mesh-ioc").Mesh;
    createHttpRequestScope(): import("mesh-ioc").Mesh;
    beforeStart(): Promise<void>;
    afterStop(): Promise<void>;
}
