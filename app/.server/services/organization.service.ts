import { OrganizationInput } from '~/models/organization.model';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { v7 } from 'uuid';
import {
  OrganizationDeadLockError,
  OrganizationHasChildError,
  OrganizationNotFoundError,
  OrganizationSelfParentError,
} from '~/models/error.model';
import { CommonService } from './common.service';
import { Organization } from '@prisma/client';

class OrganizationService extends CommonService {
  /**
   * 組織を新規作成
   * @param input 組織情報
   * @param payload idToken payload
   * @returns 作成結果
   */
  public async create(input: OrganizationInput, payload: CognitoIdTokenPayload) {
    return await this.prisma.organization.create({
      data: {
        ...input,
        id: v7(),
        updateUser: payload['cognito:username'],
      },
    });
  }

  /**
   * 組織を全部取得する
   * @returns 組織リスト
   */
  public async query(): Promise<Organization[]> {
    return await this.prisma.organization.findMany();
  }

  public async delete(id: string) {
    const children = await this.prisma.organization.findMany({ where: { parentId: id } });
    if (children.length > 0) {
      throw new OrganizationHasChildError();
    }
    return await this.prisma.organization.delete({ where: { id: id } });
  }

  public async update(id: string, input: OrganizationInput, payload: CognitoIdTokenPayload) {
    if (id === input.parentId) {
      throw new OrganizationSelfParentError();
    }
    if (input.parentId) {
      const item = await this.prisma.organization.findUnique({ where: { id: input.parentId } });
      if (!item) {
        throw new OrganizationNotFoundError();
      }
      if (item.parentId === id) {
        throw new OrganizationDeadLockError();
      }
    }
    return await this.prisma.organization.update({
      where: { id: id },
      data: {
        name: input.name,
        parentId: input.parentId,
        updateUser: payload['cognito:username'],
      },
    });
  }

  public async get(id: string): Promise<Organization> {
    const item = await this.prisma.organization.findUnique({ where: { id: id } });
    if (!item) {
      throw new OrganizationNotFoundError();
    }
    return item;
  }
}

export const organizationService = new OrganizationService();
