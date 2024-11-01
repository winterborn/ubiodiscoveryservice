import { Schema } from "@ubio/framework";
export const GroupSummarySchema = new Schema({
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
//# sourceMappingURL=groupSummary.js.map