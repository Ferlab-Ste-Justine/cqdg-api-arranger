import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';

const CosmicType = new GraphQLObjectType({
  name: 'CosmicType',
  fields: () => ({
    tumour_types_germline: { type: GraphQLString },
  }),
});

const CosmicEdgesType = new GraphQLObjectType({
  name: 'CosmicEdgesType',
  fields: () => ({
    searchAfter: { type: new GraphQLList(GraphQLInt) },
    node: { type: CosmicType },
  }),
});

const CosmicHitsType = new GraphQLObjectType({
  name: 'CosmicHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(CosmicEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const CosmicsType = new GraphQLObjectType({
  name: 'CosmicsType',
  fields: () => ({
    hits: {
      type: CosmicHitsType,
      args: hitsArgsType,
      resolve: async parent => {
        const results = parent.cosmic;
        return { total: results?.length || 0, edges: results || [] };
      },
    },
    mapping: { type: GraphQLJSON },
    extended: { type: GraphQLJSON },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: aggregationsType },
  }),
});

export default CosmicsType;