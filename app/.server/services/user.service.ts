import { CommonService } from './common.service';
import { IdTokenPayload, UserInfoInput, UserQueryInput } from '~/models/user.model';
import { Cognito } from '../utils/cognito.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { dateUtil } from '~/lib/date.util';
import { Mail } from '../utils/mail.util';
import { UserNotFoundError } from '~/models/error.model';
import { User } from '@prisma/client';

class UserService extends CommonService {
  public async get(payload: IdTokenPayload): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: payload.employeeNo },
      include: { organizations: true },
    });
  }

  public async create(userInput: UserInfoInput, payload: CognitoIdTokenPayload) {
    const { user, initPassword } = await Cognito.Admin.createUser(userInput.employeeNo, userInput.email, {
      name: userInput.name,
    });
    const result = await this.prisma.user.create({
      data: {
        id: userInput.employeeNo,
        name: userInput.name,
        email: userInput.email,
        status: userInput.status,
        cognitoUserStatus: user?.UserStatus || 'NONE',
        enterDay: userInput.enterDay,
        updateTime: dateUtil.utc(),
        updateUser: payload['cognito:username'],
        organizations: {
          create: userInput.organizations.map((o) => ({
            position: o.position,
            organizationId: o.organization,
            updateTime: dateUtil.utc(),
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
      include: {
        organizations: true,
      },
    });
  }
}

export const userService = new UserService();
