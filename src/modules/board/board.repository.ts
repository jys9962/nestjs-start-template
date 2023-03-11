import { Injectable } from "@nestjs/common";
import { MainDbRepository } from "@/shared/mysql/repository/implements/main-db.repository";
import { COLUMNS, SQL } from "@/shared/mysql/util/sql.util";
import { BoardEntity } from "@/modules/board/entities/board.entity";
import { MemberEntity } from "@/modules/member/entities/member.entity";

@Injectable()
export class BoardRepository extends MainDbRepository {

  findList() {
    const query = SQL`
        SELECT ${COLUMNS("b", BoardEntity, "board")}
             , ${COLUMNS("m", MemberEntity, "member")}
        FROM (SELECT b.id
              FROM boards b
              ORDER BY b.id DESC
              LIMIT 20) a
             INNER JOIN boards b
                        ON b.id = a.id
             INNER JOIN members m
                        ON b.member_id = m.id
    `;

    return this.select(query, {
      board: BoardEntity,
      member: MemberEntity
    });
  }

}