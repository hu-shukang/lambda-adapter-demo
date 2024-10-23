import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';

const checkLoginLoader = RequestWrapper.init(async ({ request }) => {
  return await Resp.json(request, { success: true });
})
  .withLogin()
  .loader();

export const AuthAPI = {
  loaders: {
    checkLogin: checkLoginLoader,
  },
};
