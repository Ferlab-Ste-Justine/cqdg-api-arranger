import { buildQuery } from '@arranger/middleware';

import esClient from '../../services/elasticsearch/client';
import { DEFAULT_SORT, DEFAULT_SQON } from '../common/constants';

const DEFAULT_HITS_SIZE = 10;

const simpleSorter = xs => (xs || []).map(x => ({ [x.field]: x.order }));

const searchHits = async ({
  sqon = DEFAULT_SQON,
  sort = DEFAULT_SORT,
  nestedFields = [],
  index,
  size = DEFAULT_HITS_SIZE,
  searchAfter,
  offset = 0,
}) => {
  const query = buildQuery({
    nestedFields,
    filters: sqon,
  });

  const body = {
    sort: simpleSorter(sort),
    query: query,
    search_after: searchAfter,
  };

  const result = await esClient.search({
    index,
    size,
    from: offset,
    //optimize? if total not present in the query, turn to false?
    track_total_hits: true,
    body,
  });

  const hits = result.body?.hits || {};

  return {
    total: hits?.total?.value,
    hits: hits?.hits?.map(h => h._source) || [],
  };
};

export default searchHits;
