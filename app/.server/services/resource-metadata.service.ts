import { ResourceMetadataListInput } from '~/models/resource.model';
import { ResourceNotFoundError } from '~/models/error.model';
import { CommonService } from './common.service';

class ResourceMetadataService extends CommonService {
  // Create
  public async create(input: ResourceMetadataListInput) {
    return await this.prisma.resourceMetadata.createMany({
      data: input,
    });
  }

  // Read
  public async get(tagId: string) {
    const resource = await this.prisma.resourceMetadata.findMany({
      where: { tagId: tagId },
      orderBy: { order: 'asc' },
    });

    if (resource.length === 0) {
      throw new ResourceNotFoundError();
    }

    return resource;
  }

  // Update
  public async update(input: ResourceMetadataListInput) {
    const tagId = input[0].tagId;
    const oldResources = await this.get(tagId);

    return await this.prisma.$transaction(async (tx) => {
      await tx.resourceMetadata.deleteMany({
        where: { tagId: tagId, fieldName: { in: oldResources.map((or) => or.fieldName) } },
      });
      return await tx.resourceMetadata.createMany({ data: input });
    });
  }

  // Delete
  public async delete(tagId: string) {
    return await this.prisma.resourceMetadata.deleteMany({
      where: { tagId: tagId },
    });
  }
}

export const resourceMetadataService = new ResourceMetadataService();
