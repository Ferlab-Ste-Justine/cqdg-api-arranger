import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { esBiospecimenIndex } from '../../../config/env';
import { aggsResolver, hitsResolver } from '../../common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';
import FilesType from '../../file/types/file';
import { ParticipantType } from '../../participant/types/participant';
import { StudyType } from '../../study/types/study';
import extendedMapping from '../extendedMapping';
import SampleAgg from './sampleAgg';

export const SampleType = new GraphQLObjectType({
  name: 'SampleType',
  fields: () => ({
    id: { type: GraphQLString },
    age_biospecimen_collection: { type: GraphQLString },
    biospecimen_id: { type: GraphQLString },
    biospecimen_tissue_source: { type: GraphQLString },
    release_id: { type: GraphQLString },
    sample_2_id: { type: GraphQLString },
    sample_id: { type: GraphQLString },
    sample_type: { type: GraphQLString },
    security: { type: GraphQLString },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
    submitter_biospecimen_id: { type: GraphQLString },
    submitter_sample_id: { type: GraphQLString },
    files: { type: FilesType },
    participant: { type: ParticipantType },
    study: { type: StudyType },
  }),
  extensions: {
    nestedFields: ['files'],
    esIndex: esBiospecimenIndex,
  },
});

const SampleEdgesType = new GraphQLObjectType({
  name: 'SampleEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: SampleType },
  }),
});

const SampleHitsType = new GraphQLObjectType({
  name: 'SampleHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(SampleEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const SamplesType = new GraphQLObjectType({
  name: 'SamplesType',
  fields: () => ({
    hits: {
      type: SampleHitsType,
      args: hitsArgsType,
      resolve: (parent, args) => hitsResolver(args, SampleType),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: SampleAgg,
      args: aggregationsArgsType,
      resolve: (parent, args, context, info) => aggsResolver(args, info, SampleType),
    },
  }),
});

export default SamplesType;
