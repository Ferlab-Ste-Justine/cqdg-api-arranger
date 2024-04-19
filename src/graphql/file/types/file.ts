import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { esFileIndex } from '../../../config/env';
import { aggsResolver, columnStateResolver, hitsResolver } from '../../common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';
import ParticipantsType from '../../participant/types/participant';
import SamplesType from '../../sample/types/sample';
import { StudyType } from '../../study/types/study';
import extendedMapping from '../extendedMapping';
import FileAgg from './fileAgg';
import SequencingExperimentType from './sequencingExperiment';

const FileType = new GraphQLObjectType({
  name: 'File',
  fields: () => ({
    id: { type: GraphQLString, resolve: parent => parent.file_id },
    file_id: { type: GraphQLString },
    file_2_id: { type: GraphQLString },
    biospecimen_reference: { type: GraphQLString },
    data_category: { type: GraphQLString },
    data_type: { type: GraphQLString },
    dataset: { type: GraphQLString },
    ferload_url: { type: GraphQLString },
    file_format: { type: GraphQLString },
    file_hash: { type: GraphQLString },
    file_name: { type: GraphQLString },
    file_size: { type: GraphQLFloat },
    relates_to: { type: GraphQLString },
    security: { type: GraphQLString },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
    study: { type: StudyType },
    //todo: create resolve: get participants and samples from participant_index
    participants: { type: ParticipantsType },
    biospecimens: { type: SamplesType },
    sequencing_experiment: { type: SequencingExperimentType },
  }),
  extensions: {
    nestedFields: ['participants', 'biospecimens'],
    esIndex: esFileIndex,
  },
});

const FileEdgesType = new GraphQLObjectType({
  name: 'FileEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: FileType },
  }),
});

const FileHitsType = new GraphQLObjectType({
  name: 'FileHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(FileEdgesType),
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

export const FilesType = new GraphQLObjectType({
  name: 'FilesType',
  fields: () => ({
    hits: {
      type: FileHitsType,
      args: hitsArgsType,
      resolve: (parent, args) => hitsResolver(parent, args, FileType),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: {
      type: ColumnsStateType,
      resolve: (_, args) => columnStateResolver(args, FileType),
    },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: FileAgg,
      args: aggregationsArgsType,
      resolve: (parent, args, context, info) => aggsResolver(args, info, FileType),
    },
  }),
});

export default FilesType;
