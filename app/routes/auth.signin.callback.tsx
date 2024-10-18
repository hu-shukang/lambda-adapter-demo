import 'aws-amplify/auth/enable-oauth-listener';
import { useSubmit } from '@remix-run/react';
import { Hub } from 'aws-amplify/utils';
import { toSignin } from '~/lib/auth.client';
import { useEffect } from 'react';

export default function AuthProviderCallbackPage() {
  const submit = useSubmit();

  useEffect(() => {
    const cancel = Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signedIn') {
        toSignin(submit);
      }
    });

    return () => {
      cancel();
    };
  }, [submit]);

  return <div>auth.</div>;
}
