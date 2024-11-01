var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { dep } from "mesh-ioc";
import { Router, Get, Post, Delete, PathParam, BodyParam, } from "@ubio/framework";
import { InstanceService } from "../services/InstanceService.js";
import { NotFoundError, ServerError } from "../util/CustomErrors.js";
import { HTTP_STATUS_CODES } from "../util/constants/statusCodes.js";
export class InstanceRouter extends Router {
    async testRoute() {
        return { message: "Router is working" };
    }
    async getAllInstances() {
        try {
            const instances = await this.instanceService.getAllInstances();
            return instances;
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
                return error.message;
            }
            else {
                this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
                return "An unexpected error occurred";
            }
        }
    }
    async registerInstance(group, id, meta) {
        if (!group ||
            typeof group !== "string" ||
            !id ||
            typeof id !== "string" ||
            (meta !== undefined && typeof meta !== "object")) {
            this.ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
            return "Invalid request parameters";
        }
        try {
            const result = await this.instanceService.recordHeartbeat(group, id, meta);
            if (result.createdAt === result.updatedAt) {
                this.ctx.status = HTTP_STATUS_CODES.CREATED;
            }
            else {
                this.ctx.status = HTTP_STATUS_CODES.OK;
            }
            return result;
        }
        catch (error) {
            if (error instanceof ServerError) {
                this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
                return error.message;
            }
            else {
                this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
                return "An unexpected error occurred";
            }
        }
    }
    async deleteInstance(group, id) {
        if (!group || typeof group !== "string" || !id || typeof id !== "string") {
            this.ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
            return "Invalid request parameters";
        }
        try {
            await this.instanceService.removeInstance(group, id);
            this.ctx.status = HTTP_STATUS_CODES.NO_CONTENT;
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
                return error.message;
            }
            else {
                this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
                return "An unexpected error occurred";
            }
        }
    }
    async getInstancesByGroup(group) {
        if (!group || typeof group !== "string") {
            this.ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
            return "Invalid request parameters";
        }
        try {
            const instances = await this.instanceService.getInstancesInGroup(group);
            return instances;
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
                return error.message;
            }
            else {
                this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
                return "An unexpected error occurred";
            }
        }
    }
    async getGroupSummaries() {
        try {
            const summaries = await this.instanceService.getGroupSummaries();
            return summaries;
        }
        catch (error) {
            if (error instanceof NotFoundError) {
                this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
                return error.message;
            }
            else {
                this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
                return "An unexpected error occurred";
            }
        }
    }
}
__decorate([
    dep(),
    __metadata("design:type", InstanceService)
], InstanceRouter.prototype, "instanceService", void 0);
__decorate([
    Get({
        path: "/test",
        responses: {
            [HTTP_STATUS_CODES.OK]: {
                schema: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstanceRouter.prototype, "testRoute", null);
__decorate([
    Get({
        path: "/instances",
        responses: {
            [HTTP_STATUS_CODES.OK]: {
                description: "Successfully retrieved all instances across groups",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            group: { type: "string" },
                            createdAt: { type: "number" },
                            updatedAt: { type: "number" },
                            meta: { type: "object", additionalProperties: true },
                        },
                    },
                },
            },
            [HTTP_STATUS_CODES.NOT_FOUND]: {
                description: "No instances found",
                schema: { type: "string" },
            },
            [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: {
                description: "Internal server error",
                schema: { type: "string" },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstanceRouter.prototype, "getAllInstances", null);
__decorate([
    Post({
        path: "/{group}/{id}",
        responses: {
            [HTTP_STATUS_CODES.OK]: {
                description: "Instance updated successfully",
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        group: { type: "string" },
                        createdAt: { type: "number" },
                        updatedAt: { type: "number" },
                        meta: { type: "object", additionalProperties: true },
                    },
                },
            },
            [HTTP_STATUS_CODES.CREATED]: {
                description: "Instance created successfully",
                schema: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        group: { type: "string" },
                        createdAt: { type: "number" },
                        updatedAt: { type: "number" },
                        meta: { type: "object", additionalProperties: true },
                    },
                },
            },
            [HTTP_STATUS_CODES.BAD_REQUEST]: {
                description: "Invalid request parameters",
                schema: { type: "string" },
            },
            [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: {
                description: "Internal server error",
                schema: { type: "string" },
            },
        },
    }),
    __param(0, PathParam("group", { schema: { type: "string" } })),
    __param(1, PathParam("id", { schema: { type: "string" } })),
    __param(2, BodyParam("meta", {
        schema: { type: "object", additionalProperties: true },
        required: false,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], InstanceRouter.prototype, "registerInstance", null);
__decorate([
    Delete({
        path: "/{group}/{id}",
        responses: {
            [HTTP_STATUS_CODES.NO_CONTENT]: {
                description: "Instance deleted successfully, no content returned",
            },
            [HTTP_STATUS_CODES.NOT_FOUND]: {
                description: "Instance not found",
                schema: { type: "string" },
            },
            [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: {
                description: "Internal server error",
                schema: { type: "string" },
            },
        },
    }),
    __param(0, PathParam("group", { schema: { type: "string" } })),
    __param(1, PathParam("id", { schema: { type: "string" } })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InstanceRouter.prototype, "deleteInstance", null);
__decorate([
    Get({
        path: "/{group}",
        responses: {
            [HTTP_STATUS_CODES.OK]: {
                description: "Successfully retrieved instances for the group",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            group: { type: "string" },
                            createdAt: { type: "number" },
                            updatedAt: { type: "number" },
                            meta: { type: "object", additionalProperties: true },
                        },
                    },
                },
            },
            [HTTP_STATUS_CODES.NOT_FOUND]: {
                description: "No registered groups found",
                schema: { type: "string" },
            },
            [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: {
                description: "Internal server error",
                schema: { type: "string" },
            },
        },
    }),
    __param(0, PathParam("group", { schema: { type: "string" } })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstanceRouter.prototype, "getInstancesByGroup", null);
__decorate([
    Get({
        path: "/",
        responses: {
            [HTTP_STATUS_CODES.OK]: {
                description: "Successfully retrieved group summaries",
                schema: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            group: { type: "string" },
                            instances: { type: "number" },
                            createdAt: { type: "number" },
                            lastUpdatedAt: { type: "number" },
                        },
                    },
                },
            },
            [HTTP_STATUS_CODES.NOT_FOUND]: {
                description: "No registered groups found",
                schema: { type: "string" },
            },
            [HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR]: {
                description: "Internal server error",
                schema: { type: "string" },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InstanceRouter.prototype, "getGroupSummaries", null);
//# sourceMappingURL=InstanceRouter.js.map