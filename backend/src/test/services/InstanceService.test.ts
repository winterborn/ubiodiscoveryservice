import { expect } from "chai";
import sinon from "sinon";
import { Mesh } from "mesh-ioc";
import { InstanceService } from "../../main/services/InstanceService.js";
import { InstanceRepository } from "../../main/repositories/InstanceRepository.js";
import { Metrics } from "../../main/metrics/Metrics.js";
import { NotFoundError, ServerError } from "../../main/util/CustomErrors.js";
import { Instance } from "../../main/schema/instance.js";

describe("InstanceService", () => {
  let mesh: Mesh;
  let instanceService: InstanceService;
  let instanceRepositoryMock: sinon.SinonStubbedInstance<InstanceRepository>;
  let metricsMock: sinon.SinonStubbedInstance<Metrics>;

  beforeEach(() => {
    mesh = new Mesh();

    // Create stub instances for InstanceRepository and Metrics
    instanceRepositoryMock = sinon.createStubInstance(InstanceRepository);
    metricsMock = sinon.createStubInstance(Metrics);

    // Explicitly stub nested methods in Metrics
    metricsMock.heartbeatRate = { incr: sinon.stub() } as any;
    metricsMock.errorRate = { incr: sinon.stub() } as any;
    metricsMock.expiredInstances = { incr: sinon.stub() } as any;
    metricsMock.activeInstances = { set: sinon.stub() } as any;

    // Bind the mock InstanceRepository and Metrics to the Mesh container
    mesh.constant(InstanceRepository, instanceRepositoryMock);
    mesh.constant(Metrics, metricsMock);

    // Register InstanceService in Mesh
    mesh.service(InstanceService);

    // Resolve InstanceService with dependencies injected
    instanceService = mesh.resolve(InstanceService);
  });

  it("should record a heartbeat and return the instance", async () => {
    const instance: Instance = {
      id: "instance-1",
      group: "test-group",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      meta: { key: "value" },
    };

    instanceRepositoryMock.createOrUpdateInstance.resolves(instance);

    const result = await instanceService.recordHeartbeat(
      "test-group",
      "instance-1",
      { key: "value" }
    );

    expect(result).to.include({ id: "instance-1", group: "test-group" });
  });

  it("should throw ServerError if instance is not created", async () => {
    instanceRepositoryMock.createOrUpdateInstance.resolves(undefined);

    try {
      await instanceService.recordHeartbeat("test-group", "instance-1");
      throw new Error("Expected error not thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(ServerError);
    }
  });

  it("should throw NotFoundError if instance is not found during removal", async () => {
    instanceRepositoryMock.deleteInstance.resolves(false);

    try {
      await instanceService.removeInstance("test-group", "instance-1");
      throw new Error("Expected error not thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("should return all instances across groups", async () => {
    const instances: Instance[] = [
      {
        id: "instance-1",
        group: "test-group",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: { key: "value1" },
      },
      {
        id: "instance-2",
        group: "test-group",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: { key: "value2" },
      },
    ];
    instanceRepositoryMock.fetchAllInstances.resolves(instances);

    const result = await instanceService.getAllInstances();

    expect(result.length).to.equal(2);
    expect(result[0]).to.include({ id: "instance-1", group: "test-group" });
  });

  it("should return group summaries", async () => {
    instanceRepositoryMock.fetchGroupSummaries.resolves([
      {
        group: "test-group",
        instances: 2,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
      },
    ]);

    const result = await instanceService.getGroupSummaries();

    expect(result[0]).to.have.property("group", "test-group");
    expect(result[0]).to.have.property("instances", 2);
  });

  it("should throw NotFoundError when no group summaries are found", async () => {
    instanceRepositoryMock.fetchGroupSummaries.resolves(null);

    try {
      await instanceService.getGroupSummaries();
      throw new Error("Expected error not thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("should handle empty instance list when getting active instances", async () => {
    instanceRepositoryMock.fetchAllInstances.resolves([]);

    const activeInstances = await instanceService["getActiveInstances"]();

    expect(activeInstances).to.be.empty;
  });

  it("should fetch all instances in a specific group", async () => {
    const instances: Instance[] = [
      {
        id: "instance-1",
        group: "test-group",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: { key: "value1" },
      },
      {
        id: "instance-2",
        group: "test-group",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        meta: { key: "value2" },
      },
    ];

    instanceRepositoryMock.fetchInstancesByGroup.resolves(instances);

    const result = await instanceService.getInstancesInGroup("test-group");

    expect(result.length).to.equal(2);
    expect(result[0]).to.include({ id: "instance-1", group: "test-group" });
  });

  it("should throw NotFoundError if no instances are found in a specific group", async () => {
    instanceRepositoryMock.fetchInstancesByGroup.resolves(null);

    try {
      await instanceService.getInstancesInGroup("non-existent-group");
      throw new Error("Expected error not thrown");
    } catch (error) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });

  it("should return empty array when no instances found and suppressErrors is true in getAllInstances", async () => {
    instanceRepositoryMock.fetchAllInstances.resolves(null);

    const result = await instanceService.getAllInstances(true);
    expect(result).to.be.an("array").that.is.empty;
  });

  it("should return false when removing a non-existent instance with suppressErrors set to true", async () => {
    instanceRepositoryMock.deleteInstance.resolves(false);

    const result = await instanceService.removeInstance(
      "non-existent-group",
      "non-existent-id",
      true
    );

    expect(result).to.be.false;
  });
});
