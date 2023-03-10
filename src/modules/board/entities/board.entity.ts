import { QvColumn } from "@/shared/entity-factory/qv-column";

export class BoardEntity {

  @QvColumn()
  id: number;

  @QvColumn()
  title: string;

  @QvColumn()
  contents: string;

}
