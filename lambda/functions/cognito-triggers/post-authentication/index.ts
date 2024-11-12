import { updateUser } from '/opt/nodejs/utils';
import { PostAuthenticationTriggerEvent } from 'aws-lambda';

export const handler = async (event: PostAuthenticationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    request: { userAttributes },
  } = event;
  await updateUser(userAttributes);

  return event;
};
