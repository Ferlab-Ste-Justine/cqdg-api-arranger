// Legacy code from arranger 2.16
import { buildAggregations, buildQuery, flattenAggregations } from '@arranger/middleware';

import { DEFAULT_SORT, DEFAULT_SQON } from '../common/constants';

const toGraphqlField = (acc, [a, b]) => ({
  ...acc,
  [a.replace(/\./g, '__')]: b,
});

const searchAggregations = async (
  es,
  sqon = DEFAULT_SQON,
  nestedFields = DEFAULT_SORT,
  graphqlFields,
  aggregationsFilterThemselves,
  includeMissing = true,
  searchParams,
) => {
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

  const { index } = searchParams;
  const r = await es.search({
    index,
    size: 0,
    _source: false,
    body,
  });

  const aggregations = flattenAggregations({
    aggregations: r.body.aggregations,
    includeMissing,
  });

  return Object.entries(aggregations).reduce(toGraphqlField, {});
};

export default searchAggregations;
