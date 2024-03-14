import { GraphQLObjectType } from 'graphql';

import AggregationsType, { NumericAggregationsType } from '../../common/types/aggregationsType';

const StudyAggType = new GraphQLObjectType({
  name: 'StudyAggType',
  fields: {
    contact__type: { type: AggregationsType },
    contact__value: { type: AggregationsType },
    data_access_codes__access_limitations: { type: AggregationsType },
    data_access_codes__access_requirements: { type: AggregationsType },
    data_categories__participant_count: { type: NumericAggregationsType },
    data_category: { type: AggregationsType },
    data_types__data_type: { type: AggregationsType },
    datasets__data_types: { type: AggregationsType },
    datasets__description: { type: AggregationsType },
    datasets__experimental_strategies: { type: AggregationsType },
    datasets__file_count: { type: NumericAggregationsType },
    datasets__name: { type: AggregationsType },
    datasets__participant_count: { type: NumericAggregationsType },
    description: { type: AggregationsType },
    domain: { type: AggregationsType },
    experimental_strategies__experimental_strategy: { type: AggregationsType },
    experimental_strategies__file_count: { type: NumericAggregationsType },
    family_count: { type: NumericAggregationsType },
    family_data: { type: AggregationsType },
    file_count: { type: NumericAggregationsType },
    hpo_terms: { type: AggregationsType },
    icd_terms: { type: AggregationsType },
    internal_study_id: { type: AggregationsType },
    keyword: { type: AggregationsType },
    mondo_terms: { type: AggregationsType },
    name: { type: AggregationsType },
    participant_count: { type: NumericAggregationsType },
    population: { type: AggregationsType },
    release_id: { type: AggregationsType },
    sample_count: { type: NumericAggregationsType },
    security: { type: AggregationsType },
    status: { type: AggregationsType },
    study_code: { type: AggregationsType },
    study_id: { type: AggregationsType },
    study_version: { type: AggregationsType },
  },
});

export default StudyAggType;