import { Schema } from "@ubio/framework";

export interface GroupSummary {
  group: string;
  instances: number;
  createdAt: number;
  lastUpdatedAt: number;
}

export const GroupSummarySchema = new Schema<GroupSummary>({
  schema: {
    type: "object",
    properties: {
      group: { type: "string" },
      instances: { type: "number" },
      createdAt: { type: "number" },
      lastUpdatedAt: { type: "number" },
    },
    required: ["group", "instances", "createdAt", "lastUpdatedAt"],
  },
  defaults: () => ({
    group: "",
    instances: 0,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
  }),
});
