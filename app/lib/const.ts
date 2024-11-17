export const CONST = {
  USER: {
    STATUS: {
      LIST: ['ACTIVE', 'BLOCK'],
      ACTIVE: 'ACTIVE',
      BLOCK: 'BLOCK',
    },
    COGNITO_STATUS: {
      FORCE_CHANGE_PASSWORD: 'FORCE_CHANGE_PASSWORD',
      CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED: 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED',
    },
  },
  COGNITO: {
    EXTERNAL_PROVIDER: 'EXTERNAL_PROVIDER',
    PASSWORD: 'PASSWORD',
  },
  TAG: {
    LIST: ['organization'],
    ORGANIZATION: 'organization',
  },
  ERROR_CODE: {
    AUTH: {
      USER_BLOCKED: 'USER_BLOCKED',
      EXIST_WITH_GOOGLE: 'EXIST_WITH_Google',
    },
  },
  ERROR_MSG: {
    AUTH: {
      USER_BLOCKED: 'ユーザはブロックされました。管理者までお問い合わせください。',
      EXIST_WITH_GOOGLE:
        '該当メールアドレスはすでにGoogle認証により登録されました。サインイン画面に戻ってGoogle認証を使用してサインインしてください。',
    },
  },
} as const;
