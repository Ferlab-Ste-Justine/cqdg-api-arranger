import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';

export const PhenotypeType = new GraphQLObjectType({
  name: 'PhenotypeType',
  fields: () => ({
    id: { type: GraphQLString },
    score: { type: GraphQLInt },
    age_at_event: { type: GraphQLJSON },
    internal_phenotype_id: { type: GraphQLString },
    is_leaf: { type: GraphQLBoolean },
    is_observed: { type: GraphQLBoolean },
    is_tagged: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    parents: { type: new GraphQLList(GraphQLString) },
    source_text: { type: GraphQLString },
  }),
});

const PhenotypeEdgesType = new GraphQLObjectType({
  name: 'PhenotypeEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: PhenotypeType },
  }),
});

const PhenotypeHitsType = new GraphQLObjectType({
  name: 'PhenotypeHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(PhenotypeEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const PhenotypesType = new GraphQLObjectType({
  name: 'PhenotypesType',
  fields: () => ({
    hits: {
      type: PhenotypeHitsType,
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

export default PhenotypesType;
