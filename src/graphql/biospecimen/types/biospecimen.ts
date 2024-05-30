import { aggsResolver, columnStateResolver, hitsResolver } from '@ferlab/next/lib/common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { esBiospecimenIndex } from '#src/config/env';

import { FilesType } from '../../file/types/file';
import { ParticipantType } from '../../participant/types/participant';
import { StudyType } from '../../study/types/study';
import extendedMapping from '../extendedMapping';
import BiospecimenAgg from './biospecimenAgg';

export const BiospecimenType = new GraphQLObjectType({
  name: 'BiospecimenType',
  fields: () => ({
    id: { type: GraphQLString, resolve: (parent) => parent.sample_id },
    biospecimen_id: { type: GraphQLString },
    sample_id: { type: GraphQLString },
    sample_2_id: { type: GraphQLString },
    biospecimen_tissue_source: { type: GraphQLString },
    age_biospecimen_collection: { type: GraphQLString },
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

const BiospecimenEdgesType = new GraphQLObjectType({
  name: 'BiospecimenEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: BiospecimenType },
  }),
});

const BiospecimenHitsType = new GraphQLObjectType({
  name: 'BiospecimenHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(BiospecimenEdgesType),
      resolve: async (parent, args) =>
        parent.edges.map((node) => ({
          searchAfter: args?.searchAfter || [],
          node,
        })),
    },
  }),
});

export const BiospecimensType = new GraphQLObjectType({
  name: 'BiospecimensType',
  fields: () => ({
    hits: {
      type: BiospecimenHitsType,
      args: hitsArgsType,
      resolve: (parent, args, context) => hitsResolver(parent, args, BiospecimenType, context.esClient),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: {
      type: ColumnsStateType,
      resolve: (_, args, context) => columnStateResolver(args, BiospecimenType, context.esClient),
    },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: BiospecimenAgg,
      args: aggregationsArgsType,
      resolve: (parent, args, context, info) => aggsResolver(args, info, BiospecimenType, context.esClient),
    },
  }),
});

export default BiospecimensType;
