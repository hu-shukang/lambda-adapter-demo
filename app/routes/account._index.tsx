import { LoaderFunction } from '@remix-run/node';
import { Link, useRouteLoaderData } from '@remix-run/react';
import Title from '~/components/common/title';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { UserInfoView } from '~/models/user.model';

export default function AccountPage() {
  const loaderDataForUserInfo = useRouteLoaderData<LoaderFunction>('routes/account');
  const userInfoView = loaderDataForUserInfo?.data as UserInfoView | undefined;

  if (!userInfoView) {
    return <div>no user</div>;
  }

  return (
    <div className="page-container account">
      <div className="flex justify-between items-center mb-2">
        <Title text="ユーザ情報" />
        <Button variant="link">編集</Button>
      </div>
      <div className="flex gap-10">
        {/* avator */}
        <div className="space-y-2 mt-4 flex flex-col justify-start">
          <Avatar className="w-[130px] h-[130px]">
            <AvatarImage src={userInfoView.picture} />
            <AvatarFallback>
              <AvatarImage src="blank-avator.png" />
            </AvatarFallback>
          </Avatar>
        </div>
        {/* user info */}
        <div className="flex-1 grid grid-rows-8 grid-flow-col lg:grid-rows-4 gap-4 p-4 text-nowrap">
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">お名前</span>
            <span>{userInfoView.name}</span>
            <Badge variant="success">ACTIVE</Badge>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px] ">
            <span className="inline-block font-semibold w-[125px]">社員番号</span>
            <span>xxxxxx</span>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">所属</span>
            <span>{userInfoView.organization}</span>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">役職</span>
            <span>会社員</span>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">メールアドレス</span>
            <span>{userInfoView.email}</span>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">認証方式</span>
            <span>{userInfoView.provider}</span>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">パスワード</span>
            <Link to="/account/password">
              <Button variant="link" className="p-0">
                {userInfoView.passwordResetDate ? 'パスワード設定' : 'パスワードリセット'}
              </Button>
            </Link>
          </div>
          <div className="space-x-2 h-[35px] leading-[35px]">
            <span className="inline-block font-semibold w-[125px]">前回アクセス日時</span>
            <span>2024/11/05 10:00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
