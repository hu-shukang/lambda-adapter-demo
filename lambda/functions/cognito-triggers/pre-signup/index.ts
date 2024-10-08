import { PreSignUpTriggerEvent } from 'aws-lambda';

export const handler = async (event: PreSignUpTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  return event;
};
