import { aggsResolver, columnStateResolver, hitsResolver } from '@ferlab/next/lib/common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';
import { esStudyIndex } from 'src/config/env';

import DataSetsType from '../../file/types/dataSets';
import { totalType } from '../../variant/types/frequencies';
import extendedMapping from '../extendedMapping';
import DataCategoriesType from './dataCategories';
import DataTypesType from './dataTypes';
import ExperimentalStrategiesType from './experimentalStrategies';
import StudyAggType from './studyAgg';

export const StudyContactType = new GraphQLObjectType({
  name: 'StudyContactType',
  fields: () => ({
    type: { type: GraphQLString },
    value: { type: GraphQLString },
  }),
});

export const DataAccessCodesType = new GraphQLObjectType({
  name: 'DataAccessCodesType',
  fields: () => ({
    access_limitations: { type: new GraphQLList(GraphQLString) },
    access_requirements: { type: new GraphQLList(GraphQLString) },
  }),
});

export const StudyType = new GraphQLObjectType({
  name: 'Study',
  fields: () => ({
    id: { type: GraphQLString, resolve: (parent) => parent.study_code },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
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
      resolve: (study) => {
        //do req to ES on participant_secret_centric index
      },
    },
    population: { type: GraphQLString },
    sample_count: { type: GraphQLFloat },
    security: { type: GraphQLString },
    status: { type: GraphQLString },
    study_version: { type: GraphQLString },
    contact: { type: StudyContactType },
    data_access_codes: { type: DataAccessCodesType },
    data_categories: { type: DataCategoriesType },
    data_types: { type: DataTypesType },
    datasets: { type: DataSetsType },
    experimental_strategies: { type: ExperimentalStrategiesType },

    //from VariantStudy
    transmission: { type: new GraphQLList(GraphQLString) },
    zygosity: { type: new GraphQLList(GraphQLString) },
    total: { type: totalType },
  }),
  extensions: {
    nestedFields: [],
    esIndex: esStudyIndex,
  },
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
      resolve: async (parent, args) => parent.edges.map((node) => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const StudiesType = new GraphQLObjectType({
  name: 'StudiesType',
  fields: () => ({
    hits: {
      type: StudiesHitsType,
      args: hitsArgsType,
      resolve: (parent, args, context) => hitsResolver(parent, args, StudyType, context.esClient),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: {
      type: ColumnsStateType,
      resolve: (_, args, context) => columnStateResolver(args, StudyType, context.esClient),
    },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: StudyAggType,
      args: aggregationsArgsType,
      resolve: (parent, args, context, info) => aggsResolver(args, info, StudyType, context.esClient),
    },
  }),
});

export default StudiesType;
