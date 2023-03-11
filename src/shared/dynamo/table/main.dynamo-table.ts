import { Table } from 'dynamodb-toolbox'

export enum QuvIndex {
  GSI_1 = 'gsi1',
  LSI_1 = 'lsi1',
}

export const MainTable = new Table({
  // Specify table name (used by DynamoDB)
  name: 'Quv',

  // Define partition and sort keys
  partitionKey: 'pk',
  sortKey: 'sk',

  indexes: {
    [QuvIndex.GSI_1]: {
      partitionKey: 'sk',
      sortKey: 'gsi1sk',
    },
  },
})