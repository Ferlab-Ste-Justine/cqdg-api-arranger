import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';

export const DataTypeType = new GraphQLObjectType({
  name: 'DataType',
  fields: () => ({
    score: { type: GraphQLFloat },
    data_type: { type: GraphQLString },
    participant_count: { type: GraphQLFloat },
  }),
});

const DataTypeEdgesType = new GraphQLObjectType({
  name: 'DataTypeEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: DataTypeType },
  }),
});

const DataTypeHitsType = new GraphQLObjectType({
  name: 'DataTypeHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(DataTypeEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const DataTypesType = new GraphQLObjectType({
  name: 'DataTypesType',
  fields: () => ({
    hits: {
      type: DataTypeHitsType,
      args: hitsArgsType,
      resolve: async parent => ({ total: parent?.length || 0, edges: parent || [] }),
    },
    mapping: { type: GraphQLJSON },
    extended: { type: GraphQLJSON },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: AggsStateType },
  }),
});

export default DataTypesType;
