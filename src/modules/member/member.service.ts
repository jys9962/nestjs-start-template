import { Injectable } from "@nestjs/common";
import { Transaction } from "@/providers/mysql/transaction/transaction.decorator";

@Injectable()
export class MemberService {

  constructor() {}


  @Transaction()
  test() {

  }

}