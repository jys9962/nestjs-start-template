import { Injectable } from "@nestjs/common";
import { MainDbRepository } from "@/providers/mysql/repository/implements/main-db.repository";
import { COLUMNS, SQL } from "@/providers/mysql/util/sql.util";

@Injectable()
export class BoardRepository extends MainDbRepository {


  findList() {
    const query = SQL`
    `;

    return this.select(query, {

    });
  }

}