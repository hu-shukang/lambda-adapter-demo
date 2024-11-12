import 'aws-amplify/auth/enable-oauth-listener';
import { ReactElement, useEffect, useState } from 'react';
import { Link, useSearchParams, useSubmit } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { useGlobalStore } from '~/stores/global.store';
import { toSignin } from '~/lib/auth.client';

function AuthProgressing() {
  return <div>Auth Progressing</div>;
}

function ForceChangePassword() {
  return (
    <div>
      <div>初回サインイン時に、メールで受信されたパスワードでお入りください。</div>
      <Link to="/auth/signin">
        <Button>サインイン画面に戻る</Button>
      </Link>
    </div>
  );
}

function ExistWithProvider(errorCode: string) {
  const provider = errorCode.split('_').pop();
  return (
    <div>
      <div>
        該当メールアドレスは{provider}により登録済です。{provider}認証によりお入りください。
      </div>
      <Link to="/auth/signin">
        <Button>サインイン画面に戻る</Button>
      </Link>
    </div>
  );
}

function LoginFail() {
  return (
    <div>
      <div>サインイン失敗しました。他の方式によりお入りください。</div>
      <Link to="/auth/signin">
        <Button>サインイン画面に戻る</Button>
      </Link>
    </div>
  );
}

function LoginSuccess() {
  const submit = useSubmit();
  const redirect = useGlobalStore((state) => state.redirect);

  return (
    <div>
      <div>認証成功しました。下記のボタンを押下してお入りください。</div>
      <Button onClick={() => toSignin(submit, redirect)}>進む</Button>
    </div>
  );
}

export default function AuthProviderCallbackPage() {
  // const [seconds, setSeconds] = useState(3);
  const [message, setMessage] = useState<ReactElement>(AuthProgressing());
  const [searchParams, _] = useSearchParams();

  useEffect(() => {
    console.log(searchParams.size);
    console.log('----------------------');
    const errorDesc = searchParams.get('error_description');
    if (errorDesc) {
      const regex = /error\s+(\w+)/;
      const match = errorDesc.match(regex) || ['', 'SIGNIN_FAIL'];
      const errorCode = match[1];
      if (errorCode === 'FORCE_CHANGE_PASSWORD') {
        setMessage(ForceChangePassword());
      } else if (errorCode.startsWith('EXIST_WITH_')) {
        setMessage(ExistWithProvider(errorCode));
      } else {
        setMessage(LoginFail());
      }
    }
    if (searchParams.size === 0) {
      setMessage(LoginSuccess());
    }
  }, [searchParams]);

  return message;
}
