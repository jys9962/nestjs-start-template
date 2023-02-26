import { Module } from "@nestjs/common";
import { BoardService } from "./board.service";
import { BoardRepository } from "@/modules/board/board.repository";

const usecases = [];

const services = [
  BoardService
];

const repositories = [
  BoardRepository
];

@Module({
  imports: [],
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
export class BoardModule {}