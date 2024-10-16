import { useForm, SubmitHandler } from 'react-hook-form';
import { SigninInput, signinInputSchema } from '~/models/user.model';
import PropTypes from 'prop-types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@remix-run/react';

type Props = {
  onSubmit: SubmitHandler<SigninInput>;
  signinByGoogle: () => void;
};

const SigninForm: React.FC<Props> = ({ onSubmit, signinByGoogle }) => {
  const form = useForm<SigninInput>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(signinInputSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザ名</FormLabel>
              <FormControl>
                <Input placeholder="ユーザ名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input placeholder="パスワード" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">signin</Button>
        <Button onClick={signinByGoogle}>signin by google</Button>
        <Link to="/auth/signup">
          <Button variant="link">go to signup</Button>
        </Link>
      </form>
    </Form>
  );
};

SigninForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  signinByGoogle: PropTypes.func.isRequired,
};

export default SigninForm;
