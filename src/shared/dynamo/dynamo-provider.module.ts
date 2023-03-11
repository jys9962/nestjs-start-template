import { Module } from '@nestjs/common'
import { DynamoModule } from '@/database/dynamo/dynamo.module'
import { client } from '@/shared/dynamo/client/dynamo.client'
import { MainTable } from '@/shared/dynamo/table/main.dynamo-table'

@Module({
  imports: [
    DynamoModule.forRoot(client, MainTable),
  ],
})
export class DynamoProviderModule {}