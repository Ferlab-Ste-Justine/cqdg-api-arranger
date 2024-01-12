import { GraphQLObjectType } from 'graphql';

import AggregationsType, { NumericAggregationsType } from '../../common/types/aggregationsType';
import GeneAggFields from '../../gene/types/geneAggFields';

const VariantAggType = new GraphQLObjectType({
  name: 'VariantAggType',
  fields: {
    ...GeneAggFields,
    locus: { type: AggregationsType },
    hgvsg: { type: AggregationsType },
    max_impact_score: { type: NumericAggregationsType },
    studies__study_code: { type: AggregationsType },

    variant_class: { type: AggregationsType },
    genes__consequences__consequence: { type: AggregationsType },
    variant_external_reference: { type: AggregationsType },
    chromosome: { type: AggregationsType },
    start: { type: AggregationsType },
    studies__zygosity: { type: AggregationsType },
    sources: { type: AggregationsType },
  },
});

export default VariantAggType;
