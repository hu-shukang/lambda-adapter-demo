import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import styles from './tailwind.css?url';
import { Amplify } from 'aws-amplify';
import { Resp } from './.server/utils/response.util';
import { useEffect } from 'react';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  { rel: 'stylesheet', href: styles },
];

export const loader: LoaderFunction = async ({ request }) => {
  return await Resp.json(request, {
    ENV: {
      USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
      USER_POOL_ID: process.env.USER_POOL_ID,
      REGION: process.env.REGION,
      SIGN_IN_CALLBACK: process.env.SIGN_IN_CALLBACK,
      SIGN_OUT_CALLBACK: process.env.SIGN_OUT_CALLBACK,
      USER_POOL_DOMAIN_PREFIX: process.env.USER_POOL_DOMAIN_PREFIX,
    },
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="Cache-Control" content="no-store, no-cache, must-revalidate, proxy-revalidate" />
        <meta name="Pragma" content="no-cache" />
        <meta name="Expires" content="0" />
        <meta name="theme-color" content="#0f172a" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolClientId: window.ENV.USER_POOL_CLIENT_ID,
          userPoolId: window.ENV.USER_POOL_ID,
          loginWith: {
            oauth: {
              domain: `${window.ENV.USER_POOL_DOMAIN_PREFIX}.auth.ap-northeast-1.amazoncognito.com`,
              redirectSignIn: [window.ENV.SIGN_IN_CALLBACK],
              redirectSignOut: [window.ENV.SIGN_OUT_CALLBACK],
              responseType: 'code',
              scopes: ['openid', 'email', 'profile'],
              providers: ['Google'],
            },
          },
        },
      },
    });
    console.log('Amplify.configure');
  }, []);

  return (
    <>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
    </>
  );
}
