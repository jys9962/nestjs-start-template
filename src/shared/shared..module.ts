import { Global, Module } from "@nestjs/common";
import { EntityFactoryModule } from "@/shared/entity-factory/entity-factory.module";
import { MysqlProviderModule } from "@/shared/mysql/mysql-provider.module";
import { DynamoProviderModule } from "@/shared/dynamo/dynamo-provider.module";

const modules = [
  EntityFactoryModule,
  DynamoProviderModule,
  MysqlProviderModule
];

@Global()
@Module({
  imports: [
    ...modules
  ],
  exports: [
    ...modules
  ]
})
export class SharedModule {}