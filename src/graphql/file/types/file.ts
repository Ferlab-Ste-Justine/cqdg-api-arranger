import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { esFileIndex } from '../../../config/env';
import { hitsResolver } from '../../common/resolvers';
import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';
import ParticipantsType from '../../participant/types';
import { StudyType } from '../../study/types/study';
import extendedMapping from '../extendedMapping';

const FileType = new GraphQLObjectType({
  name: 'File',
  fields: () => ({
    id: { type: GraphQLString },
    biospecimen_reference: { type: GraphQLString },
    data_category: { type: GraphQLString },
    data_type: { type: GraphQLString },
    dataset: { type: GraphQLString },
    ferload_url: { type: GraphQLString },
    file_2_id: { type: GraphQLString },
    file_format: { type: GraphQLString },
    file_hash: { type: GraphQLString },
    file_id: { type: GraphQLString },
    file_name: { type: GraphQLString },
    file_size: { type: GraphQLFloat },
    relates_to: { type: GraphQLString },
    release_id: { type: GraphQLString },
    security: { type: GraphQLString },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
    study: { type: StudyType },
    participants: { type: ParticipantsType },
    // biospecimens: { type: FileBiospecimens },
    // sequencing_experiment: { type: FileSequencingExperiment },
  }),
  extensions: {
    nestedFields: [],
    esIndex: esFileIndex,
  },
});

const FileEdgesType = new GraphQLObjectType({
  name: 'FileEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: {
      type: FileType,
    },
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
      resolve: (parent, args) => hitsResolver(args, FileType),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: aggregationsType },
  }),
});

export default FilesType;
