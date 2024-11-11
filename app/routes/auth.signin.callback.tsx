import { useEffect, useState } from 'react';
import 'aws-amplify/auth/enable-oauth-listener';
import { useSubmit } from '@remix-run/react';
import { toSignin } from '~/lib/auth.client';
import { useGlobalStore } from '~/stores/global.store';

export default function AuthProviderCallbackPage() {
  const submit = useSubmit();
  const redirect = useGlobalStore((state) => state.redirect);
  const [seconds, setSeconds] = useState(3);

  useEffect(() => {
    const timer = setInterval(async () => {
      if (seconds === 1) {
        clearInterval(timer);
        toSignin(submit, redirect);
        return;
      }
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [redirect, seconds, submit]);

  return <div>認証は成功しました。{seconds}秒後に画面遷移します。</div>;
}
