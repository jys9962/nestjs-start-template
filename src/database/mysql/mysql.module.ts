import { DynamicModule, Module } from '@nestjs/common'
import { createPool, PoolOptions } from 'mysql2/promise'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'

@Module({})
export class MysqlModule {
  static register(
    token: string | symbol,
    option: PoolOptions,
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: token,
        useValue: createPool(option),
      },
    ]

    return {
      module: MysqlModule,
      providers: providers,
      exports: providers,
      global: true,
    }
  }
}