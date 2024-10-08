import { CommonService } from './common.service';
import { UserEntity, UserInfo } from '~/models/user.model';
import { v7 } from 'uuid';

class UserService extends CommonService {
  private tableName = process.env.USER_TBL!;

  public async create(user: UserInfo) {
    const key = {
      pk: v7(),
      sk: 'USER_INFO',
    };
    return await this.createOne(this.tableName, key, user);
  }

  public async delete(pk: string) {
    const key = {
      pk: pk,
      sk: 'USER_INFO',
    };
    return await this.deleteOne(this.tableName, key);
  }

  public async update(pk: string, user: UserInfo) {
    const key = {
      pk: pk,
      sk: 'USER_INFO',
    };
    return await this.updateOne(this.tableName, key, user);
  }

  public async getDetail(pk: string) {
    const key = {
      pk: pk,
      sk: 'USER_INFO',
    };
    const result = await this.getOne(this.tableName, key);
    return result.Item as UserEntity;
  }

  public async getAll() {
    const result = await this.scanAll(this.tableName);
    return (result.Items ?? []) as UserEntity[];
  }
}

export const userService = new UserService();
