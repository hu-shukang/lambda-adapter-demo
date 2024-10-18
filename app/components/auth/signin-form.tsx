import { useForm, SubmitHandler } from 'react-hook-form';
import { SigninInput, signinInputSchema } from '~/models/user.model';
import PropTypes from 'prop-types';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@remix-run/react';
import { RiGoogleFill } from '@remixicon/react';
import Separator from '../ui/separator';

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
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
              <FormControl>
                <Input placeholder="パスワード" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          サインイン
        </Button>
        <Link to="/auth/signup">
          <Button variant="outline" className="w-full mt-4">
            新規登録
          </Button>
        </Link>
        <Separator text="あるいは" />
        <Button type="button" variant="outline" className="w-full" onClick={signinByGoogle}>
          <RiGoogleFill size={20} className="mr-2 text-primary" />
          Googleでサインイン
        </Button>
      </form>
    </Form>
  );
};

SigninForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  signinByGoogle: PropTypes.func.isRequired,
};

export default SigninForm;
