import { Global, Module } from "@nestjs/common";
import { EntityFactory } from "@/providers/mysql/entity-factory/entity-factory.service";

@Global()
@Module({
  providers: [
    EntityFactory
  ],
  exports: [
    EntityFactory
  ]
})
export class EntityFactoryModule {}