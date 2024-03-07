import { getGQLFields } from '../../common/utils';
import { searchAggregations } from '../../elasticsearch';

const aggsResolver = (args, info, type) => {
  const graphqlFields = getGQLFields(info);
  const nestedFields = type.extensions.nestedFields || [];
  const index = type.extensions.esIndex || '';

  console.log('aggsResolver info==', info);
  console.log('aggsResolver graphqlFields==', graphqlFields);

  return searchAggregations({
    sqon: args.sqon,
    aggregationsFilterThemselves: args.aggregations_filter_themselves,
    includeMissing: args.include_missing,
    graphqlFields,
    nestedFields,
    index,
  });
};

export default aggsResolver;
