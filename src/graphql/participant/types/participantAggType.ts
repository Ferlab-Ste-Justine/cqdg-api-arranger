import { GraphQLObjectType } from 'graphql';

import AggregationsType from '../../common/types/aggregationsType.js';

const ParticipantAggType = new GraphQLObjectType({
  name: 'ParticipantAgg',
  fields: {
    gender: { type: AggregationsType },
    participant_id: { type: AggregationsType },
    diagnosis__source_text: { type: AggregationsType },
  },
});

export default ParticipantAggType;
