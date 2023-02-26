import { Module } from "@nestjs/common";
import { MemberService } from "./member.service";
import { DiscoveryModule } from "@nestjs/core";

const usecases = [];

const services = [
  MemberService
];

const repositories = [];

@Module({
  imports: [
  ],
  controllers: [],
  providers: [
    ...usecases,
    ...services,
    ...repositories
  ],
  exports: [
    ...services,
    ...repositories
  ]
})
export class MemberModule {}