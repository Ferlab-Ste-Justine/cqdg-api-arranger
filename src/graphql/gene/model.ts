import { esGeneIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { searchHits } from '../elasticsearch';
import { GeneType } from './types';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esGeneIndex, file_id });
  return body._source;
};

const getHits = async ({ first, offset, sqon, sort, searchAfter, context }) => {
  const searchParams = {
    index: esGeneIndex,
    size: first,
    searchAfter,
    offset,
  };
  const nestedFields = GeneType?.extensions?.nestedFields || [];
  return searchHits({
    es: context.es,
    sqon,
    sort,
    nestedFields,
    searchParams,
  });
};

const getBy = async ({ field, value, path, args, context }) => {
  const isNested = Array.isArray(GeneType.extensions?.nestedFields)
    ? GeneType.extensions.nestedFields.includes(path)
    : false;
  const body = getBody({ field, value, path, nested: isNested });

  const res = await context.es.search({
    index: esGeneIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const GeneModel = {
  get,
  getHits,
  getBy,
};

export default GeneModel;
