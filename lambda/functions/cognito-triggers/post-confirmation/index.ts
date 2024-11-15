import { PostConfirmationTriggerEvent } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    request: { userAttributes },
  } = event;
  const prisma = new PrismaClient();
  await prisma.user.update({
    where: {
      email: userAttributes.email,
    },
    data: {
      name: userAttributes.name,
      cognitoUserStatus: userAttributes['cognito:user_status'],
    },
  });
  return event;
};
