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
