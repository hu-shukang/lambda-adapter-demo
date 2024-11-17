export class BaseError extends Error {
  constructor(
    public code: string,
    public status: number,
    public name = 'BaseError',
    public message = '',
  ) {
    super(message);
  }
}

export class OrganizationHasChildError extends BaseError {
  constructor() {
    super('OrganizationHasChild', 400, 'OrganizationHasChildError', '該当組織に所属するサブ組織があるため削除できない');
  }
}

export class OrganizationNotFoundError extends BaseError {
  constructor() {
    super('OrganizationNotFound', 400, 'OrganizationNotFoundError', '該当組織が見つからない');
  }
}

export class OrganizationDeadLockError extends BaseError {
  constructor() {
    super('OrganizationDeadLock', 400, 'OrganizationDeadLockError', 'お互いに親組織にすることができない');
  }
}

export class OrganizationSelfParentError extends BaseError {
  constructor() {
    super('OrganizationSelfParent', 400, 'OrganizationSelfParentError', '自分を親組織にすることができない');
  }
}

// employeeNo is already used
export class EmployeeNoAlreadyUsedError extends BaseError {
  constructor() {
    super('EmployeeNoAlreadyUsed', 400, 'EmployeeNoAlreadyUsedError', '社員番号が既に使用されている');
  }
}

// email is already used
export class EmailAlreadyUsedError extends BaseError {
  constructor() {
    super('EmailAlreadyUsed', 400, 'EmailAlreadyUsedError', 'メールアドレスが既に使用されている');
  }
}

// user not found
export class UserNotFoundError extends BaseError {
  constructor() {
    super('UserNotFound', 400, 'UserNotFoundError', 'ユーザが見つからない');
  }
}

// delete self
export class DeleteSelfError extends BaseError {
  constructor() {
    super('DeleteSelf', 400, 'DeleteSelfError', '自分自身を削除できない');
  }
}

export class ResourceNotFoundError extends BaseError {
  constructor() {
    super('ResourceNotFound', 400, 'ResourceNotFoundError', 'リソースが見つからない');
  }
}
