import { Instance } from "../schema/instance.js";
import { GroupSummary } from "../schema/groupSummary.js";
export declare class InstanceService {
    private instanceRepository;
    private cleanupConfig;
    private metrics;
    recordHeartbeat(group: string, id: string, meta?: Record<string, any>): Promise<Instance>;
    removeInstance(group: string, id: string, suppressErrors?: boolean): Promise<boolean>;
    getInstancesInGroup(group: string): Promise<Instance[]>;
    getAllInstances(suppressErrors?: boolean): Promise<Instance[]>;
    getGroupSummaries(): Promise<GroupSummary[]>;
    private getActiveInstances;
    private updateActiveInstanceCount;
}
