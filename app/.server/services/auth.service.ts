import { SigninInput, SignupConfirmInput, SignupInput } from '~/models/user.model';
import { Cognito } from '../utils/cognito.util';
import {
  SignUpCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ConfirmSignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';

class AuthService {
  public async signin(data: SigninInput) {
    const command = new InitiateAuthCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID,
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: data.username,
        PASSWORD: data.password,
      },
    });

    const response = await Cognito.client.send(command);

    // 获取 idToken
    const idToken = response.AuthenticationResult?.IdToken;
    console.log('SignIn success, idToken:', idToken);
    return idToken;
  }

  public async signup(data: SignupInput) {
    const command = new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID,
      Username: data.username,
      Password: data.password,
      UserAttributes: [
        {
          Name: 'email',
          Value: data.email,
        },
      ],
    });

    return await Cognito.client.send(command);
  }

  public async confirm(data: SignupConfirmInput) {
    const command = new ConfirmSignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID,
      Username: data.username,
      ConfirmationCode: data.confirmationCode,
    });

    return await Cognito.client.send(command);
  }
}

export const authService = new AuthService();
