import { useForm, SubmitHandler } from 'react-hook-form';
import { SigninInput, signinInputSchema } from '~/models/user.model';
import PropTypes from 'prop-types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';

const SigninForm: React.FC<{ onSubmit: SubmitHandler<SigninInput> }> = ({ onSubmit }) => {
  const form = useForm<SigninInput>({ resolver: zodResolver(signinInputSchema) });

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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

SigninForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SigninForm;
