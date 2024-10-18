import 'aws-amplify/auth/enable-oauth-listener';
import { useSubmit } from '@remix-run/react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { toSignin } from '~/lib/auth.client';

export default function AuthProviderCallbackPage() {
  const submit = useSubmit();

  useEffect(() => {
    const fetchAuthUser = async () => {
      const authSession = await fetchAuthSession();
      if (authSession.identityId) {
        toSignin(submit);
      }
    };
    fetchAuthUser();
  }, [submit]);

  return <div>auth.</div>;
}
