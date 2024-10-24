import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserQueryInput, userQueryInputSchema } from '~/models/user.model';
import { Form } from '../ui/form';

type Props = {
  onSubmit: SubmitHandler<UserQueryInput>;
  defaultValues?: UserQueryInput | undefined;
};

export default function UserQueryForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<UserQueryInput>({
    defaultValues: defaultValues || {
      sort: 'SK_TIME',
      block: undefined,
      name: undefined,
      organization: undefined,
    },
    resolver: zodResolver(userQueryInputSchema),
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"></form>
    </Form>
  );
}
