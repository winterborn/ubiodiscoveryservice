import { expect } from "chai";
import { InstanceRepository } from "../../main/repositories/InstanceRepository.js";

describe("InstanceRepository", () => {
  let instanceRepo: InstanceRepository;

  beforeEach(() => {
    instanceRepo = new InstanceRepository();
  });

  it("should create or update an instance", async () => {
    const instance = await instanceRepo.createOrUpdateInstance(
      "test-group",
      "instance-1",
      { updatedAt: Date.now(), meta: { key: "value" } }
    );
    expect(instance).to.have.property("id", "instance-1");
    expect(instance).to.have.property("group", "test-group");
  });

  it("should find an existing instance", async () => {
    await instanceRepo.createOrUpdateInstance("test-group", "instance-1", {
      updatedAt: Date.now(),
    });
    const instance = await instanceRepo.findInstance(
      "test-group",
      "instance-1"
    );
    expect(instance).to.not.be.null;
    expect(instance).to.have.property("id", "instance-1");
  });

  it("should delete an instance", async () => {
    await instanceRepo.createOrUpdateInstance("test-group", "instance-1", {
      updatedAt: Date.now(),
    });
    const deleted = await instanceRepo.deleteInstance(
      "test-group",
      "instance-1"
    );
    expect(deleted).to.be.true;
    const instance = await instanceRepo.findInstance(
      "test-group",
      "instance-1"
    );
    expect(instance).to.be.null;
  });

  it("should fetch all instances by group", async () => {
    await instanceRepo.createOrUpdateInstance("test-group", "instance-1", {
      updatedAt: Date.now(),
    });
    await instanceRepo.createOrUpdateInstance("test-group", "instance-2", {
      updatedAt: Date.now(),
    });
    const instances = await instanceRepo.fetchInstancesByGroup("test-group");
    expect(instances).to.have.length(2);
    expect(instances?.map((i) => i.id)).to.include.members([
      "instance-1",
      "instance-2",
    ]);
  });

  it("should fetch all instances across all groups", async () => {
    await instanceRepo.createOrUpdateInstance("group-1", "instance-1", {
      updatedAt: Date.now(),
    });
    await instanceRepo.createOrUpdateInstance("group-2", "instance-2", {
      updatedAt: Date.now(),
    });
    const instances = await instanceRepo.fetchAllInstances();
    expect(instances).to.have.length(2);
    expect(instances?.map((i) => i.id)).to.include.members([
      "instance-1",
      "instance-2",
    ]);
  });

  it("should fetch group summaries", async () => {
    const now = Date.now();
    await instanceRepo.createOrUpdateInstance("group-1", "instance-1", {
      updatedAt: now,
    });
    await instanceRepo.createOrUpdateInstance("group-1", "instance-2", {
      updatedAt: now + 1000,
    });
    await instanceRepo.createOrUpdateInstance("group-2", "instance-3", {
      updatedAt: now + 2000,
    });

    const summaries = await instanceRepo.fetchGroupSummaries();

    // Ensure summaries is not null
    expect(summaries).to.not.be.null;

    // TypeScript assertion for type narrowing
    if (summaries) {
      expect(summaries).to.have.length(2);

      const group1Summary = summaries.find((s) => s.group === "group-1");
      expect(group1Summary).to.exist;
      expect(group1Summary?.instances).to.equal(2);

      const group2Summary = summaries.find((s) => s.group === "group-2");
      expect(group2Summary).to.exist;
      expect(group2Summary?.instances).to.equal(1);
    }
  });
});
