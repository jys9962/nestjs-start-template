import { Module } from '@nestjs/common'
import { DynamoModule } from '@/database/dynamo/dynamo.module'
import { client } from '@/providers/dynamo/client/dynamo.client'
import { MainTable } from '@/providers/dynamo/table/main.dynamo-table'

@Module({
  imports: [
    DynamoModule.forRoot(client, MainTable),
  ],
})
export class DynamoProviderModule {}