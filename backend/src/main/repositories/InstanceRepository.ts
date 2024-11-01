import { Instance, InstanceSchema } from "../schema/instance.js";
import { GroupSummary, GroupSummarySchema } from "../schema/groupSummary.js";

export class InstanceRepository {
  private instanceStore: Map<string, Map<string, any>> = new Map();

  // Create or update an instance based on heartbeat
  async createOrUpdateInstance(
    group: string,
    id: string,
    data: { updatedAt: number; meta?: Record<string, any> }
  ): Promise<Instance> {
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

  // Find instance by group and id
  async findInstance(group: string, id: string): Promise<Instance | null> {
    return this.instanceStore.get(group)?.get(id) || null;
  }

  // Remove instance by group and id
  async deleteInstance(group: string, id: string): Promise<boolean> {
    const groupMap = this.instanceStore.get(group);

    if (!groupMap || !groupMap.has(id)) {
      return false;
    }

    groupMap.delete(id);

    // If group is empty, remove group as well
    if (groupMap.size === 0) {
      this.instanceStore.delete(group);
    }

    return true;
  }

  // Get all instances for a specific group
  async fetchInstancesByGroup(group: string): Promise<Instance[] | null> {
    const groupMap = this.instanceStore.get(group);
    if (!groupMap) {
      return null;
    }
    return Array.from(groupMap.values());
  }

  // Fetch all instances across all groups
  async fetchAllInstances(): Promise<Instance[] | null> {
    const allInstances: Instance[] = [];

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

  // Get group summaries with instance details
  async fetchGroupSummaries(): Promise<GroupSummary[] | null> {
    const summaries: GroupSummary[] = [];

    this.instanceStore.forEach((instances, group) => {
      if (instances.size > 0) {
        const instanceArray = Array.from(instances.values());
        const summary: GroupSummary = GroupSummarySchema.decode({
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
