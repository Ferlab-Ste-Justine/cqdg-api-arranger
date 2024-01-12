import { GraphQLBoolean, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';
import { getGQLFields } from '../../common/utils';
import FileModel from '../../file/model';
import FilesType from '../../file/type';
import SamplesType from '../../sample/type';
import ParticipantModel from '../model';
import DiagnosesType from './diagnoses';

const GenderType = new GraphQLEnumType({
  name: 'Gender',
  values: {
    female: { value: 'female' },
    male: { value: 'male' },
  },
});

export const ParticipantType = new GraphQLObjectType({
  name: 'Participant',
  fields: () => ({
    id: { type: GraphQLString },
    participant_id: { type: GraphQLString },
    participant_2_id: { type: GraphQLString },
    gender: { type: GenderType },
    age_at_recruitment: { type: GraphQLString },
    age_of_death: { type: GraphQLString },
    cause_of_death: { type: GraphQLString },
    deceasedBoolean: { type: GraphQLBoolean },
    ethnicity: { type: GraphQLString },
    family_id: { type: GraphQLString },
    family_type: { type: GraphQLString },
    is_a_proband: { type: GraphQLBoolean },
    is_affected: { type: GraphQLString },
    relationship_to_proband: { type: GraphQLString },
    release_id: { type: GraphQLString },
    security: { type: GraphQLString },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
    submitter_participant_id: { type: GraphQLString },
    vital_status: { type: GraphQLString },
    //get files direct
    files: { type: FilesType },
    //get files with new field from resolve
    files_from_participant: {
      type: FilesType,
      resolve: async participant => ({ hits: participant.files || [] }),
    },
    //get files with new field from file index
    files_from_es: {
      type: FilesType,
      args: hitsArgsType,
      resolve: async (participant, args, context) => {
        const files = await FileModel.getBy({
          field: 'participants.participant_id',
          value: participant.participant_id,
          path: 'participants',
          args,
          context,
        });
        return { hits: files };
      },
    },
    biospecimens: { type: SamplesType },
    diagnoses: { type: DiagnosesType },
    // family_relationships: { type: any() },
    // icd_tagged: { type: ParticipantIcdTagged },
    // mondo: { type: ParticipantMondo },
    // mondo_tagged: { type: ParticipantMondoTagged },
    // non_observed_phenotype_tagged: { type: ParticipantNonObservedPhenotypeTagged },
    // observed_phenotype_tagged: { type: ParticipantObservedPhenotypeTagged },
    // observed_phenotypes: { type: ParticipantObservedPhenotypes },
    // phenotypes_tagged: { type: ParticipantPhenotypesTagged },
  }),
  extensions: {
    nestedFields: ['files'],
  },
});

const ParticipantEdgesType = new GraphQLObjectType({
  name: 'ParticipantEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: ParticipantType },
  }),
});

const ParticipantHitsType = new GraphQLObjectType({
  name: 'ParticipantHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(ParticipantEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const ParticipantsType = new GraphQLObjectType({
  name: 'ParticipantsType',
  fields: () => ({
    hits: {
      type: ParticipantHitsType,
      args: hitsArgsType,
      resolve: async (parent, args, context) => {
        const result = await ParticipantModel.getHits({
          sqon: args.sqon,
          sort: args.sort,
          first: args.first,
          offset: args.offset,
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
    aggregations: {
      type: aggregationsType,
      resolve: (parent, args, context, info) => {
        const graphqlFields = getGQLFields(info);
        return ParticipantModel.getAggs(
          args.sqon,
          args.aggregations_filter_themselves,
          args.include_missing,
          context,
          graphqlFields,
        );
      },
    },
  }),
});

export default ParticipantsType;
