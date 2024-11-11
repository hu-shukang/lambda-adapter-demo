export const CONST = {
  DB: {
    INFO: 'INFO',
    ORGANIZATION: 'ORGANIZATION',
    ORGANIZATION_INFO: 'ORGANIZATION_INFO',
    USER: 'USER',
    USER_INFO: 'USER_INFO',
    USER_ORG: 'USER_ORG',
    ORG_USER: 'ORG_USER',
    PERMISSION_INFO: 'PERMISSION_INFO',
    ROLE_INFO: 'ROLE_INFO',
    INDEXS: {
      ORGANIZATION_PRIORITY_ORDER: 'ORGANIZATION_PRIORITY_ORDER',
      ORGANIZATION_PARENT: 'ORGANIZATION_PARENT',
      ORGANIZATION_USER: 'ORGANIZATION_USER',
      SK_TIME: 'SK_TIME',
    },
  },
  USER: {
    STATUS: {
      LIST: ['ACTIVE', 'BLOCK'],
      ACTIVE: 'ACTIVE',
      BLOCK: 'BLOCK',
    },
  },
  TAG: {
    LIST: ['POSITION'],
    POSITION: 'POSITION',
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
