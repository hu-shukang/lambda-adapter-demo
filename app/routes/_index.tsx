import { json, type MetaFunction } from '@remix-run/node';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { LoaderWrapper } from '~/.server/utils/request.util';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = LoaderWrapper.init<{ payload: CognitoIdTokenPayload }>(({ payload }) => {
  console.log(payload);
  return json({ message: 'successful' });
})
  .withLogin()
  .loader();

export default function Index() {
  return (
    <div>
      <div>Home Page</div>
      <div>ログインしないと入れない</div>
    </div>
  );
}
