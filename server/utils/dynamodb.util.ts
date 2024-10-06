import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// リージョンを設定する
const dbClient = new DynamoDB({ region: process.env.REGION });

const marshallOptions = {
  // 空の文字列、バイナリ、およびセットを自動的に「null」に変換するか
  convertEmptyValues: false, // デフォルト値：false
  // 挿入時に未定義の値を削除するか
  removeUndefinedValues: false, // デフォルト値：false
  // オブジェクトを map 型に変換するか
  convertClassInstanceToMap: false, // デフォルト値：false
};

const unmarshallOptions = {
  // 数値をJavaScriptのNumber型に変換するのではなく、文字列として返すか
  wrapNumbers: false, // デフォルト値：false
};

const translateConfig = { marshallOptions, unmarshallOptions };
/**
 * DynamoDBの「CRUD」操作するには、「DocumentClient」を使用します
 */
const docClient = DynamoDBDocumentClient.from(dbClient, translateConfig);

export const DB = {
  client: docClient,
};
