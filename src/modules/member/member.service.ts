import { Injectable } from "@nestjs/common";
import { Transaction } from "@/shared/mysql/transaction/transaction.decorator";

@Injectable()
export class MemberService {

  constructor() {}


  @Transaction()
  test() {

  }

}