import { esGeneIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import searchHits from '../common/searchHits';
import GeneType from './types/gene';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esGeneIndex, file_id });
  return body._source;
};

const getHits = async (first, sqon, sort, context) =>
  searchHits(context.es, sqon, sort, GeneType.extensions.nestedFields as any, {
    index: esGeneIndex,
    size: first,
  });

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: GeneType.extensions.nestedFields.includes(path) });

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
