import { Schema } from "@ubio/framework";
export const InstanceSchema = new Schema({
    schema: {
        type: "object",
        properties: {
            id: { type: "string" },
            group: { type: "string" },
            createdAt: { type: "number" },
            updatedAt: { type: "number" },
            meta: {
                type: "object",
                properties: {},
                additionalProperties: true,
                optional: true,
            },
        },
        required: ["id", "group", "createdAt", "updatedAt"],
    },
    defaults: () => ({
        id: "",
        group: "",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: {},
    }),
});
//# sourceMappingURL=instance.js.map