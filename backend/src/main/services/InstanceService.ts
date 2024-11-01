import { dep } from "mesh-ioc";
import { InstanceRepository } from "../repositories/InstanceRepository.js";
import { Instance } from "../schema/instance.js";
import { GroupSummary } from "../schema/groupSummary.js";
import { NotFoundError, ServerError } from "../util/CustomErrors.js";
import { CleanupConfig } from "../config/CleanupConfig.js";
import { Metrics } from "../metrics/Metrics.js";

export class InstanceService {
  @dep() private instanceRepository!: InstanceRepository;
  @dep() private cleanupConfig!: CleanupConfig;
  @dep() private metrics!: Metrics;

  // Register or update instance data by group and id
  async recordHeartbeat(
    group: string,
    id: string,
    meta?: Record<string, any>
  ): Promise<Instance> {
    const updatedAt = Date.now();
    const instance = await this.instanceRepository.createOrUpdateInstance(
      group,
      id,
      {
        updatedAt,
        meta,
      }
    );

    if (!instance) {
      this.metrics.errorRate.incr();
      throw new ServerError();
    }

    this.metrics.heartbeatRate.incr();
    await this.updateActiveInstanceCount();

    return { id, group, createdAt: instance.createdAt, updatedAt, meta };
  }

  // Remove instance by group and id
  async removeInstance(
    group: string,
    id: string,
    suppressErrors: boolean = false
  ): Promise<boolean> {
    const deleted = await this.instanceRepository.deleteInstance(group, id);
    if (!deleted) {
      if (!suppressErrors) {
        this.metrics.errorRate.incr();
        throw new NotFoundError();
      }
      return false;
    }

    this.metrics.expiredInstances.incr();
    await this.updateActiveInstanceCount();
    return deleted;
  }

  // Fetch all instances for a specific group
  async getInstancesInGroup(group: string): Promise<Instance[]> {
    const instances = await this.instanceRepository.fetchInstancesByGroup(
      group
    );
    if (!instances) {
      this.metrics.errorRate.incr();
      throw new NotFoundError();
    }
    return instances;
  }

  // Fetch all instances across all groups
  async getAllInstances(suppressErrors: boolean = false): Promise<Instance[]> {
    const instances = await this.instanceRepository.fetchAllInstances();
    if (!instances) {
      if (!suppressErrors) {
        this.metrics.errorRate.incr();
        throw new NotFoundError();
      }
      return [];
    }
    return instances;
  }

  // Fetch summaries of all registered groups
  async getGroupSummaries(): Promise<GroupSummary[]> {
    const summaries = await this.instanceRepository.fetchGroupSummaries();
    if (!summaries) {
      this.metrics.errorRate.incr();
      throw new NotFoundError();
    }
    return summaries;
  }

  // Filter for active instances based on expiration age
  private async getActiveInstances(): Promise<Instance[]> {
    const allInstances = await this.instanceRepository.fetchAllInstances();

    if (!allInstances) {
      return [];
    }

    const currentTime = Date.now();
    return allInstances.filter(
      (instance) =>
        currentTime - instance.updatedAt < this.cleanupConfig.EXPIRATION_AGE
    );
  }

  // Update active instance count in metrics
  private async updateActiveInstanceCount() {
    const activeInstances = await this.getActiveInstances();
    this.metrics.activeInstances.set(activeInstances.length);
  }
}
