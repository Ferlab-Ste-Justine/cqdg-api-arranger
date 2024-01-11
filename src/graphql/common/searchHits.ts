import { buildQuery } from '@arranger/middleware';

const DEFAULT_SIZE = 1;
const DEFAULT_SORT = [];

//FIXME get from arranger lib
const DEFAULT_SQON = {
  content: [],
  op: 'and',
};

const sorter = xs => (xs || []).map(x => ({ [x.field]: x.order }));

const searchHits = async (es, sqon = DEFAULT_SQON, sort = DEFAULT_SORT, nestedFields = [], searchParams) => {
  const { index, size = DEFAULT_SIZE, from = 0 } = searchParams;
  const r = await es.search({
    index,
    size,
    from,
    track_total_hits: false,
    body: {
      query: buildQuery({
        nestedFields,
        filters: sqon,
      }),
      sort: sorter(sort),
    },
  });
  return r.body?.hits?.hits?.map(h => h._source) || [];
};

export default searchHits;
