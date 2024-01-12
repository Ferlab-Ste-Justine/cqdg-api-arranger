import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import GraphQLJSON from './jsonType';
import { SortType } from './sortType';
import { RootSqonType } from './sqonType';

export const hitsArgsType = {
  first: { type: GraphQLInt },
  offset: { type: GraphQLInt },
  sort: { type: new GraphQLList(SortType) },
  sqon: { type: RootSqonType },
  searchAfter: { type: GraphQLJSON },
  filters: { type: GraphQLJSON },
};

export const aggregationsArgsType = {
  sqon: { type: RootSqonType },
  aggregations_filter_themselves: { type: GraphQLBoolean },
  include_missing: { type: GraphQLBoolean },
};

export const AggsStateType = new GraphQLObjectType({
  name: 'AggsStateType',
  fields: () => ({
    timestamp: { type: GraphQLString },
    state: { type: new GraphQLList(AggsStateType) },
  }),
});

export const ColumnsStateType = new GraphQLObjectType({
  name: 'ColumnsStateType',
  fields: () => ({
    timestamp: { type: GraphQLString },
    state: { type: new GraphQLList(ColumnsStateType) },
  }),
});

export const MatchBoxStateType = new GraphQLObjectType({
  name: 'MatchBoxStateType',
  fields: () => ({
    timestamp: { type: GraphQLString },
    state: { type: new GraphQLList(MatchBoxFieldType) },
  }),
});

export const MatchBoxFieldType = new GraphQLObjectType({
  name: 'MatchBoxFieldType',
  fields: () => ({
    displayName: { type: GraphQLString },
    field: { type: GraphQLString },
    keyField: { type: GraphQLString },
    searchFields: { type: new GraphQLList(GraphQLString) },
    isActive: { type: GraphQLBoolean },
  }),
});

export const aggregationsType = new GraphQLObjectType({
  name: 'aggregationsType',
  fields: () => ({
    participant_id: { type: GraphQLString },
  }),
});

export const hitsOthersFields = {
  mapping: { type: GraphQLString },
  extended: { type: GraphQLString },
  aggsState: { type: AggsStateType },
  columnsState: { type: ColumnsStateType },
  matchBoxState: { type: MatchBoxStateType },
  aggregations: { type: aggregationsType },
};
