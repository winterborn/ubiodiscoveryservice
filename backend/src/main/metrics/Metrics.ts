import { MetricsRegistry } from "@ubio/framework";

export class Metrics extends MetricsRegistry {
  activeInstances = this.gauge(
    "active_instances",
    "Total number of active instances"
  );
  expiredInstances = this.counter(
    "expired_instances",
    "Total number of expired instances"
  );
  heartbeatRate = this.counter("heartbeat_total", "Total heartbeats received");
  errorRate = this.counter("api_error_total", "Total API errors");
}
