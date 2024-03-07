import { esVariantIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { VariantType } from './types/variant';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esVariantIndex, file_id });
  return body._source;
};

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: VariantType?.extensions?.nestedFields?.includes(path) });

  const res = await context.es.search({
    index: esVariantIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const VariantModel = {
  get,
  getBy,
};

export default VariantModel;
