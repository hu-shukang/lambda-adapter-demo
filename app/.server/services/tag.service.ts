import { TagCategory, TagInfoInput } from '~/models/tag.model';
import { CommonService } from './common.service';
import { v7 } from 'uuid';
import { IdTokenPayload } from '~/models/user.model';

class TagService extends CommonService {
  public async create(input: TagInfoInput, payload: IdTokenPayload) {
    return await this.prisma.tag.create({
      data: {
        id: v7(),
        name: input.name,
        category: input.category,
        updateUser: payload['cognito:username'],
      },
    });
  }

  public async query(category: TagCategory) {
    return await this.prisma.tag.findMany({
      where: {
        category: category,
      },
    });
  }
}

export const tagService = new TagService();
