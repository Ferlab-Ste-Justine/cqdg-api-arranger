import { AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

export const ExperimentalStrategy = new GraphQLObjectType({
  name: 'ExperimentalStrategy',
  fields: () => ({
    score: { type: GraphQLFloat },
    experimental_strategy: { type: GraphQLString },
    file_count: { type: GraphQLFloat },
  }),
});

const ExperimentalStrategyEdgesType = new GraphQLObjectType({
  name: 'ExperimentalStrategyEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: ExperimentalStrategy },
  }),
});

const ExperimentalStrategyHitsType = new GraphQLObjectType({
  name: 'ExperimentalStrategyHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(ExperimentalStrategyEdgesType),
      resolve: async (parent, args) => parent.edges.map((node) => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const ExperimentalStrategiesType = new GraphQLObjectType({
  name: 'ExperimentalStrategiesType',
  fields: () => ({
    hits: {
      type: ExperimentalStrategyHitsType,
      args: hitsArgsType,
      resolve: async (parent) => ({ total: parent?.length || 0, edges: parent || [] }),
    },
    mapping: { type: GraphQLJSON },
    extended: { type: GraphQLJSON },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: AggsStateType },
  }),
});

export default ExperimentalStrategiesType;
