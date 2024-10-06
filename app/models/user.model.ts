import { DBKey } from './common.model';

export type UserInfo = { name: string; address: string };
export type User = UserInfo & DBKey;
