import { MetricsRegistry } from "@ubio/framework";
export declare class Metrics extends MetricsRegistry {
    activeInstances: import("@ubio/framework").GaugeMetric<any>;
    expiredInstances: import("@ubio/framework").CounterMetric<any>;
    heartbeatRate: import("@ubio/framework").CounterMetric<any>;
    errorRate: import("@ubio/framework").CounterMetric<any>;
}
