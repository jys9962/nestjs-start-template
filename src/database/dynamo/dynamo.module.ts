import { DynamicModule, Module } from '@nestjs/common'
import { Entity, Table } from 'dynamodb-toolbox'
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'
import { A } from 'ts-toolbelt'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { DynamoUtil } from '@/database/dynamo/util/dynamo.util'

@Module({})
export class DynamoModule {
  static forRoot<Name extends string, PartitionKey extends A.Key, SortKey extends A.Key | null>(
    client: DocumentClient,
    table: Table<Name, PartitionKey, SortKey>,
  ): DynamicModule {
    table.DocumentClient = client

    const providers: Provider[] = [
      {
        provide: DynamoUtil.getTableToken(),
        useValue: table,
      },
    ]

    return {
      module: DynamoModule,
      providers: providers,
      exports: providers,
      global: true,
    }
  }

  static forFeature(
    entities: Entity[],
  ): DynamicModule {
    const providers: Provider[] = entities.map(
      (entity) => {
        return {
          provide: DynamoUtil.getEntityToken(entity),
          useFactory: (table) => {
            entity.table = table
            return entity
          },
          inject: [DynamoUtil.getTableToken()],
        }
      },
    )

    return {
      module: DynamoModule,
      providers: providers,
      exports: providers,
    }
  }
}