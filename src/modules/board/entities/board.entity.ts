import { Column } from "@/providers/mysql/entity-factory/column";

export class BoardEntity {

  @Column("id", Number)
  id: number;

}
