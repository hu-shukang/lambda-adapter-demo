import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type Props = {
  picture?: string | undefined;
};

export default function UserAvator({ picture }: Props) {
  return (
    <Avatar>
      <AvatarImage src={picture} />
      <AvatarFallback>
        <AvatarImage src="blank-avator.png" />
      </AvatarFallback>
    </Avatar>
  );
}
