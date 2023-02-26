import { Module } from "@nestjs/common";
import { MysqlModule } from "@/database/mysql/mysql.module";
import { DiscoveryModule } from "@nestjs/core";
import { TransactionService } from "@/providers/mysql/transaction/transaction.service";
import { env } from "@/config/env";
import { MainDbRepository } from "@/providers/mysql/repository/implements/main-db.repository";
import { EntityFactory } from "@/providers/mysql/entity-factory/entity-factory.service";
import { EntityFactoryModule } from "@/providers/mysql/entity-factory/entity-factory.module";
import { customTypeCast } from "@/providers/mysql/util/type-caster";

@Module({
  imports: [
    DiscoveryModule,
    EntityFactoryModule,
    MysqlModule.register(
      MainDbRepository.token,
      {
        connectionLimit: env.mainDb.connectionLimit,
        host: env.mainDb.host,
        port: 3306,
        database: env.mainDb.database,
        user: env.mainDb.user,
        password: env.mainDb.password,
        typeCast: customTypeCast
      }
    )
  ],
  providers: [
    TransactionService,
    EntityFactory
  ]
})
export class MysqlProviderModule {}