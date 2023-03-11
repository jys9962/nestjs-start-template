import { QvColumn } from "@/shared/entity-factory/qv-column";

export class MemberEntity {

  @QvColumn()
  id: number

  @QvColumn()
  name: string

}
