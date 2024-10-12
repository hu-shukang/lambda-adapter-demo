import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import type { LinksFunction, LoaderFunction } from '@remix-run/node';
import styles from './tailwind.css?url';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { CookieStorage } from 'aws-amplify/utils';

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

export const loader: LoaderFunction = () => {
  return json({
    ENV: {
      USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID,
      USER_POOL_ID: process.env.USER_POOL_ID,
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
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolClientId: data.ENV.USER_POOL_CLIENT_ID,
        userPoolId: data.ENV.USER_POOL_ID,
      },
    },
  });
  cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

  return (
    <>
      <Outlet />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
      <Scripts />
    </>
  );
}
