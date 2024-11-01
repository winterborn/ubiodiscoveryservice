import { MetricsRegistry } from "@ubio/framework";
export class Metrics extends MetricsRegistry {
    constructor() {
        super(...arguments);
        this.activeInstances = this.gauge("active_instances", "Total number of active instances");
        this.expiredInstances = this.counter("expired_instances", "Total number of expired instances");
        this.heartbeatRate = this.counter("heartbeat_total", "Total heartbeats received");
        this.errorRate = this.counter("api_error_total", "Total API errors");
    }
}
//# sourceMappingURL=Metrics.js.map