import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BoardModule } from "./modules/board/board.module";
import { MemberModule } from "./modules/member/member.module";
import { MysqlProviderModule } from "./providers/mysql/mysql-provider.module";
import { DynamoProviderModule } from "@/providers/dynamo/dynamo-provider.module";
import { LoggingModule } from "@/logging/logging.module";
import { EntityFactoryModule } from "@/providers/mysql/entity-factory/entity-factory.module";

const modules = [
  BoardModule,
  MemberModule
];

@Module({
  imports: [
    MysqlProviderModule,
    DynamoProviderModule,
    LoggingModule,
    ...modules
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}