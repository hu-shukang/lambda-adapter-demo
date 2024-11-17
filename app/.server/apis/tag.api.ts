import { RequestWrapper } from '../utils/request.util';
import { tagService } from '../services/tag.service';
import { CONST } from '~/lib/const';

const queryResourceTagLoader = RequestWrapper.init(async () => {
  const data = await tagService.query(CONST.TAG.RESOURCE);
  return Response.json({ data: data, success: true });
}).loader();

export const TagAPI = {
  loader: {
    queryResource: queryResourceTagLoader,
  },
};
