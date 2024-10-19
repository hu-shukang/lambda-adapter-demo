import { Component } from 'react';
import 'aws-amplify/auth/enable-oauth-listener';
import { SubmitFunction, useSubmit } from '@remix-run/react';
import { Hub } from 'aws-amplify/utils';
import { toSignin } from '~/lib/auth.client';

type Props = {
  submit: SubmitFunction;
};

class AuthProviderCallback extends Component<Props> {
  private cancel: () => void;

  constructor(props: Props) {
    super(props);
    this.cancel = Hub.listen('auth', ({ payload: { event } }) => {
      if (event === 'signedIn') {
        toSignin(this.props.submit);
      }
    });
  }

  componentWillUnmount() {
    if (this.cancel) {
      this.cancel();
    }
  }

  render() {
    return <div>auth success</div>;
  }
}

export default function AuthProviderCallbackPage() {
  const submit = useSubmit();
  return <AuthProviderCallback submit={submit} />;
}
