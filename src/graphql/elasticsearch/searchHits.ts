import { buildQuery } from '@arranger/middleware';

import { DEFAULT_SORT, DEFAULT_SQON } from '../common/constants';

const DEFAULT_HITS_SIZE = 10;

const simpleSorter = xs => (xs || []).map(x => ({ [x.field]: x.order }));

const searchHits = async ({ es, sqon = DEFAULT_SQON, sort = DEFAULT_SORT, nestedFields = [], searchParams }) => {
  const { index, size = DEFAULT_HITS_SIZE, searchAfter, offset = 0 } = searchParams;

  const query = buildQuery({
    nestedFields,
    filters: sqon,
  });

  const body = {
    sort: simpleSorter(sort),
    query: query,
    search_after: searchAfter,
  };

  const res = await es.search({
    index,
    size,
    from: offset,
    //optimize? if total not present in the query, turn to false?
    track_total_hits: true,
    body,
  });

  const hits = res.body?.hits || {};

  return {
    total: hits?.total?.value,
    hits: hits?.hits?.map(h => h._source) || [],
  };
};

export default searchHits;
