import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';
import {
  EmployeeNoInput,
  employeeNoInputSchema,
  ID,
  idSchema,
  IdTokenPayload,
  UserInfoInput,
  userInfoInputSchema,
  UserQueryInput,
  userQueryInputSchema,
} from '~/models/user.model';
import { userService } from '../services/user.service';
import { CONST } from '~/lib/const';

const createAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as UserInfoInput;
  const payload = context.payload as IdTokenPayload;
  await userService.create(form, payload);
  return Resp.redirect(request, '/dashboard/user');
})
  .withLogin()
  .withBodyValid(userInfoInputSchema)
  .action();

const updateAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as UserInfoInput;
  const payload = context.payload as IdTokenPayload;
  await userService.update(form, payload);
  return Resp.redirect(request, '/dashboard/user');
})
  .withLogin()
  .withBodyValid(userInfoInputSchema)
  .action();

const deleteAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as EmployeeNoInput;
  await userService.delete(form.id, context.payload!);
  return Resp.json(request, { success: true });
})
  .withLogin()
  .withBodyValid(employeeNoInputSchema)
  .action();

const queryLoader = RequestWrapper.init(async ({ context, request }) => {
  const query = context.queryData as UserQueryInput;
  const result = await userService.query(query);
  console.log(JSON.stringify(result));
  return Resp.json(request, { data: result, success: true });
})
  .withLogin()
  .withQueryValid(userQueryInputSchema, { sort: CONST.DB.INDEXS.SK_TIME })
  .loader();

const getLoader = RequestWrapper.init(async ({ context, request }) => {
  const { id } = context.paramsData as ID;
  const data = await userService.get(id);
  return Resp.json(request, { data: data, success: true });
})
  .withLogin()
  .withParamsValid(idSchema)
  .loader();

export const UserAPI = {
  actions: {
    create: createAction,
    delete: deleteAction,
    update: updateAction,
  },
  loader: {
    query: queryLoader,
    get: getLoader,
  },
};
