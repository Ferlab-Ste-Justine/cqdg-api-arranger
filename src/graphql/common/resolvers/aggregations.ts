//FIXME https://github.com/robrichard/graphql-fields#deprecation-notice
import getFields from 'graphql-fields';

import searchAggregations from '../../../services/elasticsearch/searchAggregations';

const aggsResolver = async (args, info, type) => {
  const graphqlFields = getFields(info, {}, { processArguments: true });
  const nestedFields = type.extensions.nestedFields || [];
  const index = type.extensions.esIndex || '';

  return searchAggregations({
    sqon: args.filters,
    aggregationsFilterThemselves: args.aggregations_filter_themselves,
    includeMissing: args.include_missing,
    graphqlFields,
    nestedFields,
    index,
  });
};

export default aggsResolver;
