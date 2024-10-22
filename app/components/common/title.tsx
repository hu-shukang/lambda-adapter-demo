type Props = {
  text: string;
};

export default function Title({ text }: Props) {
  return <h1 className="inline-block font-semibold border-l-4 border-l-gray-700 text-gray-700 pl-2 m-2">{text}</h1>;
}
