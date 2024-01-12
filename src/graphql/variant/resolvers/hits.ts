import VariantModel from '../model';

const hitsResolver = async (parent, args, context) => {
  const result = await VariantModel.getHits({
    first: args.first,
    offset: args.offset,
    sqon: args.sqon,
    sort: args.sort,
    searchAfter: args.searchAfter,
    context,
  });
  return { total: result.total || 0, edges: result.hits || [] };
};

export default hitsResolver;
