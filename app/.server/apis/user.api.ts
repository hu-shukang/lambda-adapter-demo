import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { UserInfoInput, userInfoInputSchema, UserQueryInput, userQueryInputSchema } from '~/models/user.model';
import { userService } from '../services/user.service';
import { CONST } from '~/lib/const';

const createAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as UserInfoInput;
  const payload = context.payload as CognitoIdTokenPayload;
  await userService.create(form, payload);
  return Resp.redirect(request, '/dashboard/user');
})
  .withLogin()
  .withBodyValid(userInfoInputSchema)
  .action();

const queryLoader = RequestWrapper.init(async ({ context, request }) => {
  const query = context.queryData as UserQueryInput;
  const result = await userService.query(query);
  return Resp.json(request, { data: result, success: true });
})
  .withLogin()
  .withQueryValid(userQueryInputSchema, { sort: CONST.DB.INDEXS.SK_TIME })
  .loader();

export const UserAPI = {
  actions: {
    create: createAction,
  },
  loader: {
    query: queryLoader,
  },
};
