import { QueryOptions, ResultSetHeader } from 'mysql2/promise'
import { HttpException, Inject, Logger } from "@nestjs/common";
import { DateUtil } from '@/common/utils/date.util'
import { EntityFactoryService } from '@/shared/entity-factory/entity-factory.service'
import { QueryType, TypedResult } from '@/shared/entity-factory/entity-column.type'
import { PagingResultDto } from "@/common/dto/paging-result.dto";
import { env } from "@/config/env";

export const QUERY_FUNCTION = Symbol('query')

export abstract class AbstractRepository {
  @Inject()
  private readonly logger: Logger
  @Inject()
  private readonly classFactory: EntityFactoryService

  abstract getToken(): Symbol

  /**
   * 트랜잭션 사용시 Proxy 객체에서 다른 함수로 호출함
   */
  protected abstract [QUERY_FUNCTION](
    query: QueryOptions
  ): Promise<any>

  protected async execute(
    query: QueryOptions,
  ): Promise<ResultSetHeader> {
    return this.query(query)
  }

  protected async select<T extends QueryType>(
    query: QueryOptions,
    typeObject?: T,
  ): Promise<TypedResult<T>[]> {
    const list = await this.query(query)

    if (typeObject == null) {
      return list as any[]
    }

    if ((typeObject as any).prototype) {
      return list.map(
        (item) => this.classFactory.createEntity(item, typeObject as any),
      )
    }

    return list.map(
      (item) => this.classFactory.createEntityRecord(item, typeObject),
    )
  }

  protected async fetch<T extends QueryType>(
    query: QueryOptions,
    type?: T,
  ): Promise<TypedResult<T>> {
    const list = (await this.select(query, type)) || []
    return list[0] || null
  }

  protected async pagingSelect<T extends QueryType>(
    listQuery: QueryOptions,
    countQuery: QueryOptions,
    type?: T,
  ): Promise<PagingResultDto<TypedResult<T>>> {
    const [
      list,
      { cnt: count },
    ] = await Promise.all([
      this.select(listQuery, type),
      this.fetch(countQuery, { cnt: Number }),
    ])

    return { list, count }
  }

  private async query(
    query: QueryOptions,
  ): Promise<any> {
    const start = new Date()
    try {
      const result = await this[QUERY_FUNCTION](query)
      this.logQuery(start, query, result)
      return result
    } catch (e: any) {
      throw new HttpException(`[Query Error] ${e.sqlMessage}\n${e.sql}`, 500)
    }
  }

  private logQuery(
    start: Date,
    query: any,
    result: any,
  ) {
    if (!env.isDev) {
      return
    }

    try {
      const { sql, transactionKey } = query
      const queryTime = (+new Date()) - (+start)
      const values = [...query.values]

      const replaceQuery = sql.replaceAll('?', (
        t,
        i,
      ) => {
        const [value] = values.splice(0, 1)

        if (value == null) {
          return 'null'
        }
        if (typeof value === 'number') {
          return `${value}`
        }
        if (value instanceof Date) {
          return `'${DateUtil.format(value)}'`
        }
        if (value instanceof Buffer) {
          return `0x${value.toString('hex')}`
        }

        if (typeof value === 'string') {
          return `'${value}'`
        }
        if (Array.isArray(value)) {
          return Array.isArray(value[0])
            ? value.map(t => '(' + t.map(t => `'${t}'`).join(',') + ')').join(', ')
            : value.map(t => `'${t}'`).join(', ')
        }
        if (typeof value === 'object') {
          return Object.keys(value)
            .reduce((
              acc,
              key,
            ) => {
              acc[key] = value[key]
              return acc


            }, [])
            .join(',\n')
        }

        return `'${value}'`
      })

      this.logger.debug(`${queryTime}ms\n${transactionKey ? `\t/* TRANSACTION - ${transactionKey} */\n` : ''}${replaceQuery}\n`)
    } catch (e) {
      this.logger.error(`logQuery Error, ${JSON.stringify(e)}`)
    }
  }
}