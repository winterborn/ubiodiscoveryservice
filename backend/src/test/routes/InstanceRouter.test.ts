import { expect } from "chai";
import sinon from "sinon";
import { Mesh } from "mesh-ioc";
import { InstanceRouter } from "../../main/routes/InstanceRouter.js";
import { InstanceService } from "../../main/services/InstanceService.js";
import { NotFoundError, ServerError } from "../../main/util/CustomErrors.js";
import { HTTP_STATUS_CODES } from "../../main/util/constants/statusCodes.js";
import { Instance } from "../../main/schema/instance.js";

describe("InstanceRouter", () => {
  let mesh: Mesh;
  let instanceRouter: InstanceRouter;
  let instanceServiceMock: sinon.SinonStubbedInstance<InstanceService>;
  let ctx: any;

  beforeEach(() => {
    mesh = new Mesh();

    // Create a stub instance for InstanceService
    instanceServiceMock = sinon.createStubInstance(InstanceService);

    // Register the mock InstanceService in the Mesh container
    mesh.constant(InstanceService, instanceServiceMock);

    // Register and resolve InstanceRouter with dependencies injected
    mesh.service(InstanceRouter);
    instanceRouter = mesh.resolve(InstanceRouter);

    // Mock HTTP context
    ctx = { status: HTTP_STATUS_CODES.OK };
    Object.defineProperty(instanceRouter, "ctx", {
      get: () => ctx,
      set: (newCtx) => {
        ctx = newCtx;
      },
    });
  });

  it("should return a success message on testRoute", async () => {
    const response = await instanceRouter.testRoute();
    expect(response).to.include({ message: "Router is working" });
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.OK);
  });

  it("should retrieve all instances successfully", async () => {
    const instances: Instance[] = [
      {
        id: "1",
        group: "test",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: {},
      },
    ];
    instanceServiceMock.getAllInstances.resolves(instances);

    const response = await instanceRouter.getAllInstances();
    expect(response).to.have.lengthOf(1);
    expect(response[0]).to.include({ id: "1", group: "test" });
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.OK);
  });

  it("should handle NotFoundError when no instances are found", async () => {
    instanceServiceMock.getAllInstances.rejects(new NotFoundError());

    const response = await instanceRouter.getAllInstances();
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response).to.equal("The requested resource was not found");
  });

  it("should handle ServerError when an unexpected error occurs", async () => {
    instanceServiceMock.getAllInstances.rejects(new ServerError());

    const response = await instanceRouter.getAllInstances();
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    expect(response).to.equal("An unexpected error occurred");
  });

  it("should create or update an instance and return with status CREATED", async () => {
    const instance: Instance = {
      id: "1",
      group: "test",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      meta: { key: "value" },
    };
    instanceServiceMock.recordHeartbeat.resolves(instance);

    const response = await instanceRouter.registerInstance("test", "1", {
      key: "value",
    });
    expect(response).to.include({ id: "1", group: "test" });
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.CREATED);
  });

  it("should return BAD_REQUEST for invalid parameters in registerInstance", async () => {
    const response = await instanceRouter.registerInstance("", "1");
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.BAD_REQUEST);
    expect(response).to.equal("Invalid request parameters");
  });

  it("should delete an instance and return with status NO_CONTENT", async () => {
    instanceServiceMock.removeInstance.resolves(true);

    const response = await instanceRouter.deleteInstance("test", "1");
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.NO_CONTENT);
    expect(response).to.be.undefined;
  });

  it("should handle NotFoundError when deleting a non-existent instance", async () => {
    instanceServiceMock.removeInstance.rejects(new NotFoundError());

    const response = await instanceRouter.deleteInstance(
      "test",
      "non-existent-id"
    );
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response).to.equal("The requested resource was not found");
  });

  it("should retrieve all instances within a specific group", async () => {
    const instances: Instance[] = [
      {
        id: "1",
        group: "test",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: {},
      },
    ];
    instanceServiceMock.getInstancesInGroup.resolves(instances);

    const response = await instanceRouter.getInstancesByGroup("test");
    expect(response).to.have.lengthOf(1);
    expect(response[0]).to.include({ id: "1", group: "test" });
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.OK);
  });

  it("should handle NotFoundError when no instances are found in a specific group", async () => {
    instanceServiceMock.getInstancesInGroup.rejects(new NotFoundError());

    const response = await instanceRouter.getInstancesByGroup("test");
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response).to.equal("The requested resource was not found");
  });

  it("should retrieve group summaries successfully", async () => {
    const summaries = [
      {
        group: "test",
        instances: 2,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
      },
    ];
    instanceServiceMock.getGroupSummaries.resolves(summaries);

    const response = await instanceRouter.getGroupSummaries();
    expect(response).to.have.lengthOf(1);
    expect(response[0]).to.include({ group: "test", instances: 2 });
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.OK);
  });

  it("should handle NotFoundError when no group summaries are found", async () => {
    instanceServiceMock.getGroupSummaries.rejects(new NotFoundError());

    const response = await instanceRouter.getGroupSummaries();
    expect(ctx.status).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    expect(response).to.equal("The requested resource was not found");
  });
});
