import { esVariantIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { searchAggregations, searchHits } from '../elasticsearch';
import VariantType from './types';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esVariantIndex, file_id });
  return body._source;
};

const getHits = async ({ first, offset, sqon, sort, searchAfter, context }) => {
  const searchParams = {
    index: esVariantIndex,
    size: first,
    searchAfter,
    offset,
  };
  const nestedFields = VariantType.extensions.nestedFields || [];
  return searchHits({
    es: context.es,
    sqon,
    sort,
    nestedFields,
    searchParams,
  });
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

const getAggs = async ({ sqon, aggregationsFilterThemselves, includeMissing, context, graphqlFields }) =>
  searchAggregations(
    context.es,
    sqon,
    VariantType.extensions.nestedFields,
    graphqlFields,
    aggregationsFilterThemselves,
    includeMissing,
    { index: esVariantIndex },
  );

const VariantModel = {
  get,
  getHits,
  getBy,
  getAggs,
};

export default VariantModel;
