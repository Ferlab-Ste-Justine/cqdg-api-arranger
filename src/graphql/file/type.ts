import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLScalarType, GraphQLString } from 'graphql';

import {
  aggregationsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  jsonType,
  MatchBoxStateType,
} from '../common/types';
import ParticipantsType from '../participant/type';
import { StudyType } from '../study/type';
import FileModel from './model';

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
});

const FileEdgesType = new GraphQLObjectType({
  name: 'FileEdgesType',
  fields: () => ({
    searchAfter: { type: jsonType },
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
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

export const FilesType = new GraphQLObjectType({
  name: 'FilesType',
  fields: () => ({
    hits: {
      type: FileHitsType,
      args: hitsArgsType,
      resolve: async (parent, args, context) => {
        const results = await FileModel.getHits(args.first, args.sqon, args.sort, context);
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

export default FilesType;
