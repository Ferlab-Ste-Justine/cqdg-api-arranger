import { esBiospecimenIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { searchHits } from '../elasticsearch';
import SampleType from './type';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esBiospecimenIndex, file_id });
  return body._source;
};

const getHits = async ({ first, offset, sqon, sort, searchAfter, context }) => {
  const searchParams = {
    index: esBiospecimenIndex,
    size: first,
    searchAfter,
    offset,
  };
  const nestedFields = SampleType.extensions.nestedFields || [];
  return searchHits({
    es: context.es,
    sqon,
    sort,
    nestedFields,
    searchParams,
  });
};

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: SampleType?.extensions?.nestedFields?.includes(path) });

  const res = await context.es.search({
    index: esBiospecimenIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const SampleModel = {
  get,
  getHits,
  getBy,
};

export default SampleModel;
