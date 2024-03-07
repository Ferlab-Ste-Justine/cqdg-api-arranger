// Legacy code from arranger 2.16
import { buildAggregations, buildQuery, flattenAggregations } from '@arranger/middleware';

import esClient from '../../services/elasticsearch/client';
import { DEFAULT_SORT, DEFAULT_SQON } from '../common/constants';

const toGraphqlField = (acc, [a, b]) => ({
  ...acc,
  [a.replace(/\./g, '__')]: b,
});

const searchAggregations = async ({
  sqon = DEFAULT_SQON,
  nestedFields = DEFAULT_SORT,
  graphqlFields,
  aggregationsFilterThemselves,
  includeMissing = true,
  index,
}) => {
  const query = buildQuery({
    nestedFields,
    filters: sqon,
  });

  const aggs = buildAggregations({
    query,
    sqon,
    graphqlFields,
    nestedFields,
    aggregationsFilterThemselves,
  });

  const body = Object.keys(query || {}).length ? { query, aggs } : { aggs };

  const result = await esClient.search({
    index,
    // size: 0,
    // from: 0,
    track_total_hits: true,
    body,
  });

  const aggregations = flattenAggregations({
    aggregations: result.body.aggregations,
    includeMissing,
  });

  return Object.entries(aggregations).reduce(toGraphqlField, {});
};

export default searchAggregations;
