import { dep } from "mesh-ioc";
import {
  Router,
  Get,
  Post,
  Delete,
  PathParam,
  BodyParam,
} from "@ubio/framework";
import { InstanceService } from "../services/InstanceService.js";
import { NotFoundError, ServerError } from "../util/CustomErrors.js";
import { HTTP_STATUS_CODES } from "../util/constants/statusCodes.js";

export class InstanceRouter extends Router {
  @dep() private instanceService!: InstanceService;

  // Test routing
  @Get({
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
  })
  async testRoute() {
    return { message: "Router is working" };
  }

  // Get all instances across all groups
  @Get({
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
  })
  async getAllInstances() {
    try {
      const instances = await this.instanceService.getAllInstances();
      return instances;
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
        return error.message;
      } else {
        this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        return "An unexpected error occurred";
      }
    }
  }

  // Create or update instance via heartbeat
  @Post({
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
  })
  async registerInstance(
    @PathParam("group", { schema: { type: "string" } }) group: string,
    @PathParam("id", { schema: { type: "string" } }) id: string,
    @BodyParam("meta", {
      schema: { type: "object", additionalProperties: true },
      required: false,
    })
    meta?: Record<string, any>
  ) {
    if (
      !group ||
      typeof group !== "string" ||
      !id ||
      typeof id !== "string" ||
      (meta !== undefined && typeof meta !== "object")
    ) {
      this.ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
      return "Invalid request parameters";
    }

    try {
      const result = await this.instanceService.recordHeartbeat(
        group,
        id,
        meta
      );

      if (result.createdAt === result.updatedAt) {
        this.ctx.status = HTTP_STATUS_CODES.CREATED;
      } else {
        this.ctx.status = HTTP_STATUS_CODES.OK;
      }

      return result;
    } catch (error) {
      if (error instanceof ServerError) {
        this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        return error.message;
      } else {
        this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        return "An unexpected error occurred";
      }
    }
  }

  // Delete instance by group and id
  @Delete({
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
  })
  async deleteInstance(
    @PathParam("group", { schema: { type: "string" } }) group: string,
    @PathParam("id", { schema: { type: "string" } }) id: string
  ) {
    if (!group || typeof group !== "string" || !id || typeof id !== "string") {
      this.ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
      return "Invalid request parameters";
    }

    try {
      await this.instanceService.removeInstance(group, id);
      this.ctx.status = HTTP_STATUS_CODES.NO_CONTENT;
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
        return error.message;
      } else {
        this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        return "An unexpected error occurred";
      }
    }
  }

  // Get all instances within a specific group
  @Get({
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
  })
  async getInstancesByGroup(
    @PathParam("group", { schema: { type: "string" } }) group: string
  ) {
    if (!group || typeof group !== "string") {
      this.ctx.status = HTTP_STATUS_CODES.BAD_REQUEST;
      return "Invalid request parameters";
    }

    try {
      const instances = await this.instanceService.getInstancesInGroup(group);
      return instances;
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
        return error.message;
      } else {
        this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        return "An unexpected error occurred";
      }
    }
  }

  // Get summaries of all groups
  @Get({
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
  })
  async getGroupSummaries() {
    try {
      const summaries = await this.instanceService.getGroupSummaries();
      return summaries;
    } catch (error) {
      if (error instanceof NotFoundError) {
        this.ctx.status = HTTP_STATUS_CODES.NOT_FOUND;
        return error.message;
      } else {
        this.ctx.status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
        return "An unexpected error occurred";
      }
    }
  }
}
