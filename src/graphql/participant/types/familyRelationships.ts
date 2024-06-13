import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';

const FamilyRelationshipType = new GraphQLObjectType({
  name: 'FamilyRelationshipType',
  fields: () => ({
    id: { type: GraphQLString },
    score: { type: GraphQLFloat },
    family_id: { type: GraphQLString },
    family_type: { type: GraphQLString },
    focus_participant_id: { type: GraphQLString },
    is_affected: { type: GraphQLString },
    participant_id: { type: GraphQLString },
    relationship_to_proband: { type: GraphQLString },
    submitter_family_id: { type: GraphQLString },
    submitter_participant_id: { type: GraphQLString },
  }),
});

const FamilyRelationshipsEdgesType = new GraphQLObjectType({
  name: 'FamilyRelationshipsEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: FamilyRelationshipType },
  }),
});

const FamilyRelationshipsHitsType = new GraphQLObjectType({
  name: 'FamilyRelationshipsHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(FamilyRelationshipsEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const FamilyRelationshipsType = new GraphQLObjectType({
  name: 'FamilyRelationshipsType',
  fields: () => ({
    hits: {
      type: FamilyRelationshipsHitsType,
      args: hitsArgsType,
      resolve: async parent => {
        const results = parent.family_relationships;
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

export default FamilyRelationshipsType;
