import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';
import styles from './tailwind.css?url';

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

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

// export function ErrorBoundary() {
//   const error = useRouteError();

//   // 处理 Remix 的错误响应
//   if (isRouteErrorResponse(error)) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="max-w-md p-6 bg-white shadow-md rounded">
//           <h1 className="text-xl font-semibold text-red-600">Error {error.status}</h1>
//           <p className="mt-2 text-gray-700">
//             {error.data.message || 'An error occurred while processing your request.'}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // 处理其他类型的错误
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="max-w-md p-6 bg-white shadow-md rounded">
//         <h1 className="text-xl font-semibold text-red-600">Something went wrong</h1>
//         <p className="mt-2 text-gray-700">{error instanceof Error ? error.message : 'An unknown error occurred.'}</p>
//       </div>
//     </div>
//   );
// }

export default function App() {
  return <Outlet />;
}
