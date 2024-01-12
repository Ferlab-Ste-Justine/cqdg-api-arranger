import { esParticipantIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { searchAggregations, searchHits } from '../elasticsearch';
import { ParticipantType } from './types';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esParticipantIndex, file_id });
  return body._source;
};

const getHits = async ({ first, offset, sqon, sort, searchAfter, context }) => {
  const searchParams = {
    index: esParticipantIndex,
    size: first,
    searchAfter,
    offset,
  };
  const nestedFields = ParticipantType.extensions?.nestedFields || [];
  return searchHits({
    es: context.es,
    sqon,
    sort,
    nestedFields,
    searchParams,
  });
};

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: ParticipantType?.extensions?.nestedFields?.includes(path) });

  const res = await context.es.search({
    index: esParticipantIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const getAggs = async (sqon, aggregations_filter_themselves, include_missing, ctx, graphqlFields) =>
  searchAggregations(
    ctx.es,
    sqon,
    ParticipantType.extensions.nestedFields,
    graphqlFields,
    aggregations_filter_themselves,
    include_missing,
    { index: esParticipantIndex },
  );

const ParticipantModel = {
  get,
  getHits,
  getBy,
  getAggs,
};

export default ParticipantModel;
