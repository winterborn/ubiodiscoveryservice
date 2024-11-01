import { Schema } from "@ubio/framework";
export interface GroupSummary {
    group: string;
    instances: number;
    createdAt: number;
    lastUpdatedAt: number;
}
export declare const GroupSummarySchema: Schema<GroupSummary>;
