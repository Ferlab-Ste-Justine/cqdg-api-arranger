import { esVariantIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import searchHits from '../common/searchHits';
import VariantType from './types/variant';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esVariantIndex, file_id });
  return body._source;
};

const getHits = async (first, sqon, sort, context) =>
  searchHits(context.es, sqon, sort, VariantType.extensions.nestedFields, {
    index: esVariantIndex,
    size: first,
  });

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: VariantType.extensions.nestedFields.includes(path) });

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
  getHits,
  getBy,
};

export default VariantModel;
