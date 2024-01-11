import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import {
  aggregationsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  jsonType,
  MatchBoxStateType,
} from '../common/types';
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
    searchAfter: { type: jsonType },
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
        const results = await StudyModel.getHits(args.first, args.sqon, args.sort, context);
        return { total: results?.length || 0, edges: results || [] };
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
