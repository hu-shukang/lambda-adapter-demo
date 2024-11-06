import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { UserActionLog } from '~/models/log.model';

const client = new SQSClient({ region: process.env.REGION });

const sendUserAction = async (action: UserActionLog) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.LOG_SQS_URL,
    MessageBody: JSON.stringify(action),
  });
  return client.send(command);
};

export const SQS = {
  log: {
    sendUserAction: sendUserAction,
  },
};
