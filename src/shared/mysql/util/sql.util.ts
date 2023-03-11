import { QueryOptions } from 'mysql2/promise'
import { ColumnInfo } from '@/shared/entity-factory/entity-column.type'
import { NonFunctionProperties } from '@/common/utils/type.util'
import { EntityColumnContainer } from '@/shared/entity-factory/entity-column.container'
import { EntityColumnUtil } from '@/shared/entity-factory/entity-column.util'

class SqlParam {
  constructor(
    readonly sql: string,
    readonly value: any[],
  ) {}
}

export const COLUMNS = <T, K extends keyof NonFunctionProperties<T>>(
  alias: string,
  type: { new(): T },
  as: string,
  pick?: K[],
) => {
  const pickSet = Array.isArray(pick) && pick.length ? new Set(pick) : null
  const columns = EntityColumnContainer
    .getInfo(type)
    .filter(
      (t: ColumnInfo) => !pickSet || pickSet.has(t.propertyName as any),
    )
    .map(
      (t: ColumnInfo) => `\`${alias}\`.\`${t.columnName}\` AS \`${EntityColumnUtil.asColumn(as, t.columnName)}\``)
    .join('\n,')

  return new SqlParam(
    `/* ${alias}.${type.name} as ${as} */\n${columns}\n`,
    [],
  )
}

export const ARRAYAGG = <T, K extends keyof T>(
  alias: string,
  type: { new(): T },
  pick?: K[],
) => {
  const pickSet = Array.isArray(pick) && pick.length ? new Set(pick) : null
  const arrayAgg = EntityColumnContainer
    .getInfo(type)
    .filter(
      (t: ColumnInfo) => !pickSet || pickSet.has(t.propertyName as any),
    )
    .map(
      (t: ColumnInfo) => `'${t.columnName}',${alias}.${t.columnName}`)
    .join('\n,')

  return new SqlParam(
    `JSON_ARRAYAGG(JSON_OBJECT(${arrayAgg}))`,
    [],
  )
}

export const VALUES = (valuesList: any[][]) => {
  const valueString = valuesList
    .map((values) => `ROW(${values.map(() => '?').join(', ')})`)
    .join(', ')

  return new SqlParam(
    `VALUES ${valueString}`,
    valuesList.flatMap(t => t),
  )
}

export const TO_JSON = (item: object) => {
  if (item == null) {
    return null
  }
  if (item instanceof Set) {
    item = Array.from(item)
  }

  if (item instanceof Map) {
    item = Array
      .from(item.entries())
      .reduce((
        acc,
        [key, value],
      ) => {
        acc[key] = value
        return acc
      }, {})
  }

  return JSON.stringify(item)
}

export const SQL = (
  strings,
  ...params: any[]
): QueryOptions => {
  const result: QueryOptions = {
    sql: '',
    values: [],
  }

  strings.forEach((
    stringPart,
    i,
  ) => {
    result.sql += stringPart
    if (i >= strings.length - 1) {
      return
    }

    set(params[i])
  })

  return result

  function set(param: any) {
    if (typeof param === 'function') {
      const paramResult = param()
      if (typeof paramResult === 'string') {
        result.sql += paramResult
        return
      }

      result.sql += '?'
      result.values.push(JSON.stringify(paramResult))
      return
    }

    // values ...
    if (param instanceof SqlParam) {
      result.sql += param.sql
      result.values.push(...param.value)
      return
    }

    // set -> array
    if (param instanceof Set) {
      return set(Array.from(param))
    }

    // map -> object
    if (param instanceof Map) {
      return set(
        Array
          .from(param.entries())
          .reduce((
            acc,
            [key, value],
          ) => {
            acc[key] = value
            return acc
          }, {}),
      )
    }

    result.sql += '?'
    result.values.push(param)
  }
}