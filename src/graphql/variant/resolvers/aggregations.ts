import { getGQLFields } from '../../common/utils';
import VariantModel from '../model';

const aggResolver = (parent, args, context, info) => {
  const graphqlFields = getGQLFields(info);

  return VariantModel.getAggs({
    sqon: args.sqon,
    aggregationsFilterThemselves: args.aggregations_filter_themselves,
    includeMissing: args.include_missing,
    context,
    graphqlFields,
  });
};

export default aggResolver;
