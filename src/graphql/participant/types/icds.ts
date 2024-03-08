import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';

export const IcdType = new GraphQLObjectType({
  name: 'IcdType',
  fields: () => ({
    id: { type: GraphQLString },
    score: { type: GraphQLInt },
    age_at_event: { type: GraphQLJSON },
    internal_phenotype_id: { type: GraphQLString },
    is_leaf: { type: GraphQLBoolean },
    is_tagged: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    parents: { type: new GraphQLList(GraphQLString) },
    source_text: { type: GraphQLString },
  }),
});

const IcdsEdgesType = new GraphQLObjectType({
  name: 'IcdsEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: IcdType },
  }),
});

const IcdsHitsType = new GraphQLObjectType({
  name: 'IcdsHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(IcdsEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const IcdsType = new GraphQLObjectType({
  name: 'IcdsType',
  fields: () => ({
    hits: {
      type: IcdsHitsType,
      args: hitsArgsType,
      resolve: async parent => ({ total: parent?.length || 0, edges: parent || [] }),
    },
    mapping: { type: GraphQLJSON },
    extended: { type: GraphQLJSON },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: aggregationsType },
  }),
});

export default IcdsType;
