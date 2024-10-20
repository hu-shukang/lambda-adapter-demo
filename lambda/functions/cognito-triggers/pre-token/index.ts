import { PreTokenGenerationTriggerEvent } from 'aws-lambda';

export const handler = async (event: PreTokenGenerationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  event.response.claimsOverrideDetails.claimsToAddOrOverride = {};

  return event;
};
