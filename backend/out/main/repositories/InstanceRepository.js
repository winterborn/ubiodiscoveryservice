import { InstanceSchema } from "../schema/instance.js";
import { GroupSummarySchema } from "../schema/groupSummary.js";
export class InstanceRepository {
    constructor() {
        this.instanceStore = new Map();
    }
    async createOrUpdateInstance(group, id, data) {
        const groupMap = this.instanceStore.get(group) || new Map();
        const instance = InstanceSchema.decode({
            id,
            group,
            createdAt: groupMap.get(id)?.createdAt || Date.now(),
            updatedAt: data.updatedAt,
            meta: data.meta,
        });
        groupMap.set(id, instance);
        this.instanceStore.set(group, groupMap);
        return instance;
    }
    async findInstance(group, id) {
        return this.instanceStore.get(group)?.get(id) || null;
    }
    async deleteInstance(group, id) {
        const groupMap = this.instanceStore.get(group);
        if (!groupMap || !groupMap.has(id)) {
            return false;
        }
        groupMap.delete(id);
        if (groupMap.size === 0) {
            this.instanceStore.delete(group);
        }
        return true;
    }
    async fetchInstancesByGroup(group) {
        const groupMap = this.instanceStore.get(group);
        if (!groupMap) {
            return null;
        }
        return Array.from(groupMap.values());
    }
    async fetchAllInstances() {
        const allInstances = [];
        this.instanceStore.forEach((groupMap) => {
            groupMap.forEach((instance) => {
                allInstances.push(instance);
            });
        });
        if (allInstances.length === 0) {
            return null;
        }
        return allInstances;
    }
    async fetchGroupSummaries() {
        const summaries = [];
        this.instanceStore.forEach((instances, group) => {
            if (instances.size > 0) {
                const instanceArray = Array.from(instances.values());
                const summary = GroupSummarySchema.decode({
                    group,
                    instances: instances.size,
                    createdAt: instanceArray[0].createdAt,
                    lastUpdatedAt: instanceArray[instanceArray.length - 1].updatedAt,
                });
                summaries.push(summary);
            }
        });
        if (summaries.length === 0) {
            return null;
        }
        return summaries;
    }
}
//# sourceMappingURL=InstanceRepository.js.map