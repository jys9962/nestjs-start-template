import { Module } from "@nestjs/common";
import { MysqlModule } from "@/database/mysql/mysql.module";
import { DiscoveryModule } from "@nestjs/core";
import { TransactionService } from "@/shared/mysql/transaction/transaction.service";
import { env } from "@/config/env";
import { MainDbRepository } from "@/shared/mysql/repository/implements/main-db.repository";
import { customTypeCast } from "@/shared/mysql/util/type-caster";

@Module({
  imports: [
    DiscoveryModule,
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
    TransactionService
  ]
})
export class MysqlProviderModule {}