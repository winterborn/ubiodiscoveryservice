import { Schema } from "@ubio/framework";
export interface Instance {
    id: string;
    group: string;
    createdAt: number;
    updatedAt: number;
    meta?: Record<string, any>;
}
export declare const InstanceSchema: Schema<Instance>;
