import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BoardModule } from "./modules/board/board.module";
import { MemberModule } from "./modules/member/member.module";
import { MysqlProviderModule } from "./shared/mysql/mysql-provider.module";
import { DynamoProviderModule } from "@/shared/dynamo/dynamo-provider.module";
import { LoggingModule } from "@/logging/logging.module";
import { EntityFactoryModule } from "@/shared/entity-factory/entity-factory.module";
import { SharedModule } from "@/shared/shared..module";

const modules = [
  BoardModule,
  MemberModule
];

@Module({
  imports: [
    SharedModule,
    LoggingModule,
    ...modules
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}