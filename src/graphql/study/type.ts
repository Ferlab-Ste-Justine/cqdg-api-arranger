import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../common/types';
import GraphQLJSON from '../common/types/jsonType';
import StudyModel from './model';

export const StudyType = new GraphQLObjectType({
  name: 'Study',

  fields: () => ({
    id: { type: GraphQLString },
    data_category: { type: GraphQLString },
    description: { type: GraphQLString },
    domain: { type: new GraphQLList(GraphQLString) },
    family_count: { type: GraphQLFloat },
    family_data: { type: GraphQLBoolean },
    file_count: { type: GraphQLFloat },
    hpo_terms: { type: new GraphQLList(GraphQLString) },
    icd_terms: { type: new GraphQLList(GraphQLString) },
    internal_study_id: { type: GraphQLString },
    keyword: { type: new GraphQLList(GraphQLString) },
    mondo_terms: { type: new GraphQLList(GraphQLString) },
    name: { type: GraphQLString },
    participant_count: { type: GraphQLFloat },
    participant_count2: {
      type: GraphQLFloat,
      resolve: study => {
        //do req to ES on participant_secret_centric index
      },
    },
    population: { type: GraphQLString },
    release_id: { type: GraphQLString },
    sample_count: { type: GraphQLFloat },
    security: { type: GraphQLString },
    status: { type: GraphQLString },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
    study_version: { type: GraphQLString },

    // contact: { type: StudyContact },
    // data_access_codes: { type: StudyData_access_codes },
  }),
});

const StudyEdgesType = new GraphQLObjectType({
  name: 'StudyEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: StudyType },
  }),
});

const StudiesHitsType = new GraphQLObjectType({
  name: 'StudiesHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(StudyEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const StudiesType = new GraphQLObjectType({
  name: 'StudiesType',
  fields: () => ({
    hits: {
      type: StudiesHitsType,
      args: hitsArgsType,
      resolve: async (parent, args, context) => {
        const result = await StudyModel.getHits({
          first: args.first,
          offset: args.offset,
          sqon: args.sqon,
          sort: args.sort,
          searchAfter: args.searchAfter,
          context,
        });
        return { total: result.total || 0, edges: result.hits || [] };
      },
    },
    mapping: { type: GraphQLString },
    extended: { type: GraphQLString },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: aggregationsType },
  }),
});

export default StudiesType;
