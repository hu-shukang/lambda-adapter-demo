import { useSubmit } from '@remix-run/react';
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect } from 'react';
import { toSignin } from '~/lib/auth.client';

export default function AuthProviderCallbackPage() {
  const submit = useSubmit();

  useEffect(() => {
    const fetchAuthUser = async () => {
      const authUser = await getCurrentUser();
      if (authUser.userId) {
        toSignin(submit);
      }
    };
    fetchAuthUser();
  }, [submit]);

  return <div>auth.</div>;
}
