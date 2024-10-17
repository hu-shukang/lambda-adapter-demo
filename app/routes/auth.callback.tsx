import { Card, CardHeader, CardTitle } from '~/components/ui/card';
import { useLoaderData } from '@remix-run/react';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { LoaderFunction } from '@remix-run/node';

export const loader = RequestWrapper.init(({ request }) => {
  return Resp.json(request, { sucess: true });
}).loader();

export default function AuthProviderCallbackPage() {
  const data = useLoaderData<LoaderFunction>();

  return (
    <div>
      <Card className="w-[600px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>OAuth認証成功</CardTitle>
          {JSON.stringify(data)}
        </CardHeader>
      </Card>
    </div>
  );
}
