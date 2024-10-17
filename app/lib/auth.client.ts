import { SubmitFunction } from '@remix-run/react';

export const toSignin = (submit: SubmitFunction, redirectUrl?: string | null) => {
  const provider = 'CognitoIdentityServiceProvider';
  const userPoolClientId = window.ENV.USER_POOL_CLIENT_ID;
  const authUser = localStorage.getItem(`${provider}.${userPoolClientId}.LastAuthUser`);
  const idToken = localStorage.getItem(`${provider}.${userPoolClientId}.${authUser}.idToken`);
  const refreshToken = localStorage.getItem(`${provider}.${userPoolClientId}.${authUser}.refreshToken`);
  if (!idToken || !refreshToken) {
    throw new Error('login success, but no token');
  }
  const formData = new FormData();
  formData.append('idToken', idToken);
  formData.append('refreshToken', refreshToken);
  formData.append('redirectUrl', redirectUrl || '/');
  submit(formData, { method: 'POST', action: '/api/auth/signin' });
};
