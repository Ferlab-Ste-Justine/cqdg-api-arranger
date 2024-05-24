import {
  aggregationsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { GraphQLBoolean, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

export const DiagnosisType = new GraphQLObjectType({
  name: 'DiagnosisType',
  fields: () => ({
    id: { type: GraphQLString },
    score: { type: GraphQLInt },

    // from current diagnoses
    age_at_diagnosis: { type: GraphQLString },
    diagnosis_ICD_code: { type: GraphQLString },
    diagnosis_icd_display: { type: GraphQLString },
    diagnosis_mondo_code: { type: GraphQLString },
    diagnosis_mondo_display: { type: GraphQLString },
    diagnosis_source_text: { type: GraphQLString },
    fhir_id: { type: GraphQLString },

    // from current mondo
    age_at_event: { type: GraphQLJSON },
    internal_phenotype_id: { type: GraphQLString },
    is_leaf: { type: GraphQLBoolean },
    is_tagged: { type: GraphQLBoolean },
    name: { type: GraphQLString },
    parents: { type: new GraphQLList(GraphQLString) },
    source_text: { type: GraphQLString },
  }),
});

const DiagnosisEdgesType = new GraphQLObjectType({
  name: 'DiagnosisEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: DiagnosisType },
  }),
});

const DiagnosisHitsType = new GraphQLObjectType({
  name: 'DiagnosisHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(DiagnosisEdgesType),
      resolve: async (parent, args) => parent.edges.map((node) => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const DiagnosesType = new GraphQLObjectType({
  name: 'DiagnosesType',
  fields: () => ({
    hits: {
      type: DiagnosisHitsType,
      args: hitsArgsType,
      resolve: async (parent) => ({ total: parent?.length || 0, edges: parent || [] }),
    },
    mapping: { type: GraphQLJSON },
    extended: { type: GraphQLJSON },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: aggregationsType },
  }),
});

export default DiagnosesType;
