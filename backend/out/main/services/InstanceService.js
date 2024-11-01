var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { dep } from "mesh-ioc";
import { InstanceRepository } from "../repositories/InstanceRepository.js";
import { NotFoundError, ServerError } from "../util/CustomErrors.js";
import { CleanupConfig } from "../config/CleanupConfig.js";
import { Metrics } from "../metrics/Metrics.js";
export class InstanceService {
    async recordHeartbeat(group, id, meta) {
        const updatedAt = Date.now();
        const instance = await this.instanceRepository.createOrUpdateInstance(group, id, {
            updatedAt,
            meta,
        });
        if (!instance) {
            this.metrics.errorRate.incr();
            throw new ServerError();
        }
        this.metrics.heartbeatRate.incr();
        await this.updateActiveInstanceCount();
        return { id, group, createdAt: instance.createdAt, updatedAt, meta };
    }
    async removeInstance(group, id, suppressErrors = false) {
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
    async getInstancesInGroup(group) {
        const instances = await this.instanceRepository.fetchInstancesByGroup(group);
        if (!instances) {
            this.metrics.errorRate.incr();
            throw new NotFoundError();
        }
        return instances;
    }
    async getAllInstances(suppressErrors = false) {
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
    async getGroupSummaries() {
        const summaries = await this.instanceRepository.fetchGroupSummaries();
        if (!summaries) {
            this.metrics.errorRate.incr();
            throw new NotFoundError();
        }
        return summaries;
    }
    async getActiveInstances() {
        const allInstances = await this.instanceRepository.fetchAllInstances();
        if (!allInstances) {
            return [];
        }
        const currentTime = Date.now();
        return allInstances.filter((instance) => currentTime - instance.updatedAt < this.cleanupConfig.EXPIRATION_AGE);
    }
    async updateActiveInstanceCount() {
        const activeInstances = await this.getActiveInstances();
        this.metrics.activeInstances.set(activeInstances.length);
    }
}
__decorate([
    dep(),
    __metadata("design:type", InstanceRepository)
], InstanceService.prototype, "instanceRepository", void 0);
__decorate([
    dep(),
    __metadata("design:type", CleanupConfig)
], InstanceService.prototype, "cleanupConfig", void 0);
__decorate([
    dep(),
    __metadata("design:type", Metrics)
], InstanceService.prototype, "metrics", void 0);
//# sourceMappingURL=InstanceService.js.map