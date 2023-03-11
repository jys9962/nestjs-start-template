import { QvColumn } from '@/shared/entity-factory/qv-column'

export class TestEntity {
  @QvColumn()
  id: number

  @QvColumn()
  title: string
}
