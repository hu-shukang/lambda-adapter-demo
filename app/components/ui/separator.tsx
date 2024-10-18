type Props = {
  text: string;
};

export default function Separator({ text }: Props) {
  return (
    <div className="h-[30px] w-full flex flex-row items-center space-x-3">
      <div className="h-[1px] flex-1 bg-gray-300"></div>
      <div className="text-sm text-gray-400">{text}</div>
      <div className="h-[1px] flex-1 bg-gray-300"></div>
    </div>
  );
}
