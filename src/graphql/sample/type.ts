import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../common/types';
import GraphQLJSON from '../common/types/jsonType';
import FilesType from '../file/type';
import { ParticipantType } from '../participant/types';
import { StudyType } from '../study/type';
import SampleModel from './model';

const SampleType = new GraphQLObjectType({
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
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const SamplesType = new GraphQLObjectType({
  name: 'SamplesType',
  fields: () => ({
    hits: {
      type: SampleHitsType,
      args: hitsArgsType,
      resolve: async (parent, args, context) => {
        const result = await SampleModel.getHits({
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

export default SamplesType;
