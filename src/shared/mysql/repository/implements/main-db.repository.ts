import { Inject } from '@nestjs/common'
import { Pool, QueryOptions } from 'mysql2/promise'
import { AbstractRepository, QUERY_FUNCTION } from '@/shared/mysql/repository/abstract.repository'

export class MainDbRepository extends AbstractRepository {
  static token = Symbol('MainDbRepository')

  @Inject(MainDbRepository.token)
  private readonly pool: Pool

  getToken(): symbol {
    return MainDbRepository.token
  }

  protected async [QUERY_FUNCTION](query: QueryOptions) {
    const [result] = await this.pool.query(query)
    return result
  }
}
