import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';

export const DataCategoryType = new GraphQLObjectType({
  name: 'DataCategory',
  fields: () => ({
    score: { type: GraphQLFloat },
    data_category: { type: GraphQLString },
    participant_count: { type: GraphQLFloat },
  }),
});

const DataCategoryEdgesType = new GraphQLObjectType({
  name: 'DataCategoryEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: DataCategoryType },
  }),
});

const DataCategoryHitsType = new GraphQLObjectType({
  name: 'DataCategoryHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(DataCategoryEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const DataCategoriesType = new GraphQLObjectType({
  name: 'DataCategoriesType',
  fields: () => ({
    hits: {
      type: DataCategoryHitsType,
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

export default DataCategoriesType;
