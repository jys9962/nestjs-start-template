import { Entity } from 'dynamodb-toolbox'

export const DYNAMO_TABLE = Symbol('DYNAMO_TABLE')
const ENTITY_TOKEN_PREFIX = 'entity$'

export class DynamoUtil {
  static getEntityToken(entity: Entity) {
    return `${ENTITY_TOKEN_PREFIX}${entity.name}`
  }

  static getTableToken() {
    return DYNAMO_TABLE
  }
}