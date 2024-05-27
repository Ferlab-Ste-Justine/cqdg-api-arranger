import { aggsResolver, columnStateResolver, hitsResolver } from '@ferlab/next/lib/common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { GraphQLBoolean, GraphQLEnumType, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { esParticipantIndex } from '#src/config/env';

import { BiospecimensType } from '../../biospecimen/types/biospecimen';
import { FilesType } from '../../file/types/file';
import { StudyType } from '../../study/types/study';
import extendedMapping from '../extendedMapping';
import DiagnosesType from './diagnoses';
import FamilyRelationshipsType from './familyRelationships';
import IcdsType from './icds';
import ParticipantAgg from './participantAgg';
import PhenotypesType from './phenotypes';

const SexType = new GraphQLEnumType({
  name: 'Sex',
  values: {
    female: { value: 'female' },
    male: { value: 'male' },
  },
});

export const ParticipantType = new GraphQLObjectType({
  name: 'Participant',
  fields: () => ({
    id: { type: GraphQLString, resolve: (parent) => parent.participant_id },
    participant_id: { type: GraphQLString },
    participant_2_id: { type: GraphQLString },
    sex: { type: SexType },
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
    security: { type: GraphQLString },
    study_code: { type: GraphQLString },
    study_id: { type: GraphQLString },
    submitter_participant_id: { type: GraphQLString },
    vital_status: { type: GraphQLString },
    study: { type: StudyType },
    files: { type: FilesType },
    biospecimens: { type: BiospecimensType },
    family_relationships: { type: FamilyRelationshipsType },
    icd_tagged: { type: IcdsType },
    diagnoses: { type: DiagnosesType },
    mondo: { type: DiagnosesType },
    mondo_tagged: { type: DiagnosesType },
    phenotypes_tagged: { type: PhenotypesType },
    non_observed_phenotype_tagged: { type: PhenotypesType },
    observed_phenotype_tagged: { type: PhenotypesType },
    observed_phenotypes: { type: PhenotypesType },
  }),
  extensions: {
    nestedFields: [
      'files',
      'biospecimens',
      'family_relationships',
      'icd_tagged',
      'diagnoses',
      'mondo',
      'mondo_tagged',
      'phenotypes_tagged',
      'non_observed_phenotype_tagged',
      'observed_phenotype_tagged',
      'observed_phenotypes',
    ],
    esIndex: esParticipantIndex,
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
      resolve: async (parent, args) =>
        parent.edges.map((node) => ({
          searchAfter: args?.searchAfter || [],
          node,
        })),
    },
  }),
});

export const ParticipantsType = new GraphQLObjectType({
  name: 'ParticipantsType',
  fields: () => ({
    hits: {
      type: ParticipantHitsType,
      args: hitsArgsType,
      resolve: (parent, args, context) => hitsResolver(parent, args, ParticipantType, context.esClient),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: {
      type: ColumnsStateType,
      resolve: (_, args, context) => columnStateResolver(args, ParticipantType, context.esClient),
    },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: ParticipantAgg,
      args: aggregationsArgsType,
      resolve: (parent, args, context, info) => aggsResolver(args, info, ParticipantType, context.esClient),
    },
  }),
});

export default ParticipantsType;
