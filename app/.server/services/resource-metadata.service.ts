import { ResourceMetadataInput } from '~/models/resource.model';
import { CommonService } from './common.service';
import { CONST } from '~/lib/const';
import { v7 } from 'uuid';
import { IdTokenPayload } from '~/models/user.model';

class ResourceMetadataService extends CommonService {
  // Create
  public async create(input: ResourceMetadataInput, payload: IdTokenPayload) {
    return await this.prisma.tag.create({
      data: {
        id: v7(),
        name: input.name,
        category: CONST.TAG.RESOURCE,
        updateUser: payload['cognito:username'],
        resourceMetadata: {
          createMany: {
            data: input.items,
          },
        },
      },
    });
  }

  // Read
  public async get(tagId: string) {
    return await this.prisma.tag.findUnique({
      where: { id: tagId },
      include: { resourceMetadata: { orderBy: { order: 'asc' } } },
    });
  }

  // Update
  public async update(tagId: string, input: ResourceMetadataInput, payload: IdTokenPayload) {
    return await this.prisma.tag.update({
      where: { id: tagId },
      data: {
        name: input.name,
        updateUser: payload['cognito:username'],
        resourceMetadata: {
          deleteMany: {},
          createMany: {
            data: input.items,
          },
        },
      },
    });
  }

  // Delete
  public async delete(tagId: string) {
    return await this.prisma.tag.delete({ where: { id: tagId } });
  }
}

export const resourceMetadataService = new ResourceMetadataService();
