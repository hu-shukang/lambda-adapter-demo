import { CommonService } from './common.service';
import { IdTokenPayload, UserInfoInput, UserQueryInput } from '~/models/user.model';
import { Cognito } from '../utils/cognito.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Mail } from '../utils/mail.util';
import { UserNotFoundError } from '~/models/error.model';
import { User } from '@prisma/client';
import { CONST } from '~/lib/const';
import { v7 } from 'uuid';

class UserService extends CommonService {
  public async get(payload: IdTokenPayload): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email: payload.email },
      include: { organizations: true },
    });
  }

  private async getAndUpdateTags(userInput: UserInfoInput, payload: CognitoIdTokenPayload) {
    const positionList = userInput.organizations.map((o) => o.position);
    const tags = await this.prisma.tag.findMany({
      select: { id: true, name: true },
      where: {
        name: {
          in: positionList,
        },
      },
    });
    const newTags = positionList.filter((p) => !tags.some((t) => t.name === p)).map((p) => ({ id: v7(), name: p }));
    if (newTags.length > 0) {
      tags.push(...newTags);
      await this.prisma.tag.createMany({
        data: newTags.map((t) => ({
          id: t.id,
          name: t.name,
          category: CONST.TAG.ORGANIZATION,
          updateUser: payload['cognito:username'],
        })),
      });
    }
    return tags;
  }

  public async create(userInput: UserInfoInput, payload: CognitoIdTokenPayload) {
    const { user, initPassword } = await Cognito.Admin.createUser(userInput.employeeNo, userInput.email, {
      name: userInput.name,
    });
    const tags = await this.getAndUpdateTags(userInput, payload);
    const result = await this.prisma.user.create({
      data: {
        id: userInput.employeeNo,
        name: userInput.name,
        email: userInput.email,
        status: userInput.status,
        cognitoUserStatus: user?.UserStatus || 'NONE',
        enterDay: userInput.enterDay,
        updateUser: payload['cognito:username'],
        organizations: {
          create: userInput.organizations.map((o) => ({
            position: tags.find((t) => t.name === o.position)!.id,
            organizationId: o.organization,
            updateUser: payload['cognito:username'],
          })),
        },
      },
    });
    await Mail.sendText([userInput.email], `初期パスワード：${initPassword}`);
    return result;
  }

  public async delete(employeeNo: string, payload: IdTokenPayload) {
    await this.prisma.$transaction(async (tx) => {
      const deleteResult = await tx.user.deleteMany({
        where: {
          id: employeeNo,
          NOT: {
            id: payload.employeeNo,
          },
        },
      });
      if (deleteResult.count === 0) {
        throw new UserNotFoundError();
      }
      await Cognito.Admin.deleteUser(employeeNo);
    });
  }

  public async update(id: string, userInput: UserInfoInput, payload: IdTokenPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
    });
    if (!user) {
      throw new UserNotFoundError();
    }
    const tags = await this.getAndUpdateTags(userInput, payload);
    const result = await this.prisma.user.update({
      where: { id: id },
      data: {
        name: userInput.name,
        email: userInput.email,
        status: userInput.status,
        enterDay: userInput.enterDay,
        updateUser: payload.employeeNo,
        organizations: {
          deleteMany: {},
          create: userInput.organizations.map((o) => ({
            position: tags.find((t) => t.name === o.position)!.id,
            organizationId: o.organization,
            updateUser: payload.employeeNo,
          })),
        },
      },
    });
    return result;
  }

  public async query(query: UserQueryInput) {
    // 构建动态 where 条件
    const where: any = {};

    // 按名称搜索
    if (query.name) {
      where.name = {
        startsWith: query.name,
        mode: 'insensitive',
      };
    }

    // 按状态过滤
    if (query.status) {
      where.status = query.status;
    }

    // 按组织过滤
    if (query.organization) {
      where.organizations = {
        some: {
          organizationId: query.organization,
        },
      };
    }

    return await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        enterDay: true,
        cognitoUserStatus: true,
        organizations: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
            organization: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });
  }
}

export const userService = new UserService();
