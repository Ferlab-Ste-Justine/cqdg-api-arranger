import searchHits from '../../../services/elasticsearch/searchHits';

const hitsResolver = async (args, type) => {
  const nestedFields = type.extensions.nestedFields || [];
  const index = type.extensions.esIndex || '';

  const result = await searchHits({
    sort: args.sort,
    size: args.first,
    sqon: args.filters,
    offset: args.offset,
    searchAfter: args.searchAfter,
    nestedFields,
    index,
  });

  return { total: result.total || 0, edges: result.hits || [] };
};

export default hitsResolver;
