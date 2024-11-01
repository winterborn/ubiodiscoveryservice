import { Instance } from "../schema/instance.js";
import { GroupSummary } from "../schema/groupSummary.js";
export declare class InstanceRepository {
    private instanceStore;
    createOrUpdateInstance(group: string, id: string, data: {
        updatedAt: number;
        meta?: Record<string, any>;
    }): Promise<Instance>;
    findInstance(group: string, id: string): Promise<Instance | null>;
    deleteInstance(group: string, id: string): Promise<boolean>;
    fetchInstancesByGroup(group: string): Promise<Instance[] | null>;
    fetchAllInstances(): Promise<Instance[] | null>;
    fetchGroupSummaries(): Promise<GroupSummary[] | null>;
}
