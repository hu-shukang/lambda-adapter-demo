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
