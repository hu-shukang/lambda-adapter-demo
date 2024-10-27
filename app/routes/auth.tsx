import { Outlet } from '@remix-run/react';
import { RiBubbleChartFill } from '@remixicon/react';

export default function AuthLayout() {
  return (
    <div className="h-screen w-screen bg-slate-950 overflow-hidden flex">
      <div className="flex-1 flex-col justify-between text-white p-10 hidden md:flex">
        <div className="flex items-center h-[30px]">
          <RiBubbleChartFill size={36} color="white" className="mr-4" />
          <span>Lambda-Adapter-Demo</span>
        </div>
        <div className="h-[30px] text-right">Create By Remix＆React</div>
      </div>
      <div className="flex-1 flex p-10 bg-white items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
