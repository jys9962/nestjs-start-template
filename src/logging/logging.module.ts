import { Global, Logger, Module } from "@nestjs/common";
import { LoggerService } from "@/logging/service/logger.service";

@Global()
@Module({
  providers: [
    Logger,
    LoggerService
  ],
  exports: [
    Logger,
  ]
})
export class LoggingModule {}