import { EntityFactoryService } from "@/shared/entity-factory/entity-factory.service";
import { TestBed } from "@automock/jest";
import { Logger } from "@nestjs/common";
import { TestEntity } from "@/common/test/test.entity";

describe("EntityFactory", function() {
  let entityFactoryService: EntityFactoryService;
  let logger: jest.Mocked<Logger>;

  beforeAll(async function() {
    const { unit, unitRef } = TestBed.create(EntityFactoryService)
      .compile();

    entityFactoryService = unit;
    logger = unitRef.get(Logger);
  });

  describe("create", function() {
    it("basic class", function() {

      const item = {
        id: 123,
        title: "bbb"
      };
      const type = TestEntity;

      const entity = entityFactoryService.create(item, type);

      expect(entity).toBeDefined();
      expect(entity).toBeInstanceOf(TestEntity);
      expect(entity).toEqual(item);
    });

    it("basic class", async function() {
      const item = {
        "item1.id": 123,
        "item1.title": "bbb",
        "item2": {
          id: 123,
          title: "bb2"
        }
      };
      const type = {
        item1: TestEntity,
        item2: TestEntity
      };
      const entity = entityFactoryService.create(item, type);
      const expectedItem1 = {
        id: 123,
        title: "bbb"
      };
      const expectedItem2 = {
        id: 123,
        title: "bb2"
      };

      expect(entity).toBeDefined();

      expect(entity.item1).toBeDefined();
      expect(entity.item1).toBeInstanceOf(TestEntity);
      expect(entity.item1).toEqual(expectedItem1);

      expect(entity.item2).toBeDefined();
      expect(entity.item2).toBeInstanceOf(TestEntity);
      expect(entity.item2).toEqual(expectedItem2);
    });

    it("should be null", function() {
      const item = {
        "item1.id": 123,
        "item1.title": "123",
        "item2.id": null,
        "item2.title": null
      };

      const type = {
        item1: TestEntity,
        item2: TestEntity
      };

      const result = entityFactoryService.create(item, type);
      expect(result.item2).toBeNull();
    });

    it("should be thrown", function() {
      const item = {
        "item1.id": 123,
        "item1.title": "123"
      };

      const type = {
        item1: TestEntity,
        item2: TestEntity
      };

      // expect(() => entityFactoryService.create(item, type))
      //   .toThrow()
      // expect(() => entityFactoryService.create(item, { item1: TestEntity, item2: Boolean }))
      //   .toThrow()

    });
  });
});

