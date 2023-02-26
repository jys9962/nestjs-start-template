import * as AWS from 'aws-sdk'
import * as https from 'https'
import { env } from "@/config/env";

AWS.config.update({ region: 'ap-northeast-2' })
export const client = new AWS.DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  credentials: {
    accessKeyId: env.aws.accessKey,
    secretAccessKey: env.aws.secretKey,
  },
  httpOptions: {
    agent: new https.Agent({
      keepAlive: true,
    }),
  },
})
