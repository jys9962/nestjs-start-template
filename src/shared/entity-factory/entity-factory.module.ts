import { Module } from '@nestjs/common'
import { EntityFactoryService } from '@/shared/entity-factory/entity-factory.service'

@Module({
  providers: [
    EntityFactoryService,
  ],
  exports: [
    EntityFactoryService,
  ],
})
export class EntityFactoryModule {}