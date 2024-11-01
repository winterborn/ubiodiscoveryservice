import { Router } from "@ubio/framework";
export declare class InstanceRouter extends Router {
    private instanceService;
    testRoute(): Promise<{
        message: string;
    }>;
    getAllInstances(): Promise<string | import("../schema/instance.js").Instance[]>;
    registerInstance(group: string, id: string, meta?: Record<string, any>): Promise<string | import("../schema/instance.js").Instance>;
    deleteInstance(group: string, id: string): Promise<string | undefined>;
    getInstancesByGroup(group: string): Promise<string | import("../schema/instance.js").Instance[]>;
    getGroupSummaries(): Promise<string | import("../schema/groupSummary.js").GroupSummary[]>;
}
