import { AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

export const DataSetType = new GraphQLObjectType({
  name: 'DataSet',
  fields: () => ({
    id: { type: GraphQLString },
    score: { type: GraphQLFloat },
    description: { type: GraphQLString },
    name: { type: GraphQLString },
    file_count: { type: GraphQLFloat },
    participant_count: { type: GraphQLFloat },
    data_types: { type: new GraphQLList(GraphQLString) },
    experimental_strategies: { type: new GraphQLList(GraphQLString) },
  }),
});

const DataSetEdgesType = new GraphQLObjectType({
  name: 'DataSetEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: DataSetType },
  }),
});

const DataSetHitsType = new GraphQLObjectType({
  name: 'DataSetHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(DataSetEdgesType),
      resolve: async (parent, args) => parent.edges.map((node) => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const DataSetsType = new GraphQLObjectType({
  name: 'DataSetsType',
  fields: () => ({
    hits: {
      type: DataSetHitsType,
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

export default DataSetsType;
