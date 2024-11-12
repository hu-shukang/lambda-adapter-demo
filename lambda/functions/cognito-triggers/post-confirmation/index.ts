import { updateUser } from '/opt/nodejs/dist/utils';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    request: { userAttributes },
  } = event;
  await updateUser(userAttributes);

  return event;
};
