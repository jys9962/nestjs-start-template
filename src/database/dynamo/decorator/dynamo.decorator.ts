import { Inject } from '@nestjs/common'
import { DynamoUtil } from '@/database/dynamo/util/dynamo.util'
import { Entity } from 'dynamodb-toolbox'

export const InjectEntity = (entity: Entity) => {
  return Inject(
    DynamoUtil.getEntityToken(entity),
  )
}
export const InjectTable = () => {
  return Inject(
    DynamoUtil.getTableToken(),
  )
}