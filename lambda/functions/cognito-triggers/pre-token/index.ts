import { PreTokenGenerationTriggerEvent } from 'aws-lambda';
import { PrismaClient } from '@prisma/client';

export const handler = async (event: PreTokenGenerationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    request: {
      userAttributes: { email },
    },
  } = event;
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: { organizations: true },
  });
  if (user === null) {
    throw new Error('get token failed');
  }

  if (user.status === 'BLOCKED') {
    throw new Error('USER_BLOCKED');
  }

  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      organizations: user.organizations.map((org) => org.organizationId).join(','),
      employeeNo: user.id,
      status: user.status,
    },
  };

  return event;
};
