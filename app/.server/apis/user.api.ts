import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';
import {
  EmployeeNoInput,
  employeeNoInputSchema,
  IdTokenPayload,
  UserInfoInput,
  userInfoInputSchema,
  UserInfoUpdateInput,
  userInfoUpdateInputSchema,
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
  const form = context.bodyData as UserInfoUpdateInput;
  const payload = context.payload as IdTokenPayload;
  const { id, ...data } = form;
  await userService.update(id, data, payload);
  return Resp.redirect(request, '/dashboard/user');
})
  .withLogin()
  .withBodyValid(userInfoUpdateInputSchema)
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
  return Resp.json(request, { data: result, success: true });
})
  .withLogin()
  .withQueryValid(userQueryInputSchema, { sort: CONST.DB.INDEXS.SK_TIME })
  .loader();

const getLoader = RequestWrapper.init(async ({ context, request }) => {
  const data = await userService.get(context.payload!);
  return Resp.json(request, { data: data, success: true });
})
  .withLogin()
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
