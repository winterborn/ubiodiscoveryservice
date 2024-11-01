import { useEffect, useState } from "react";

const trackedMetrics = [
  "active_instances",
  "expired_instances",
  "heartbeat_total",
  "api_error_total",
];

const POLLING_INTERVAL =
  Number(process.env.REACT_APP_POLLING_INTERVAL) || 10000;

export const MetricsDisplay: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({
    active_instances: 0,
    expired_instances: 0,
    heartbeat_total: 0,
    api_error_total: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("http://localhost:8080/metrics");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.text();
        const parsedMetrics: Record<string, number> = {};

        data.split("\n").forEach((line) => {
          const trimmedLine = line.trim();
          trackedMetrics.forEach((metric) => {
            if (trimmedLine.startsWith(metric)) {
              const [key, value] = trimmedLine.split(/\s+/);
              parsedMetrics[key] = Number(value);
            }
          });
        });

        setMetrics((prevMetrics) => ({ ...prevMetrics, ...parsedMetrics }));
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    // Initial fetch and set interval for polling
    fetchMetrics();
    const interval = setInterval(fetchMetrics, POLLING_INTERVAL);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="metrics-dashboard">
      <h1>Metrics Dashboard</h1>
      <div className="metrics-container">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="metric-card">
            <h2>{key.replace(/_/g, " ").toUpperCase()}</h2>
            <p>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsDisplay;
