import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql/index';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, jsonType, MatchBoxStateType } from './index';

export const DiagnosisType = new GraphQLObjectType({
  name: 'DiagnosisType',
  fields: () => ({
    id: { type: GraphQLString },
    score: { type: GraphQLInt },
    age_at_diagnosis: { type: GraphQLString },
    diagnosis_ICD_code: { type: GraphQLString },
    diagnosis_icd_display: { type: GraphQLString },
    diagnosis_mondo_code: { type: GraphQLString },
    diagnosis_mondo_display: { type: GraphQLString },
    diagnosis_source_text: { type: GraphQLString },
    fhir_id: { type: GraphQLString },
  }),
});

const DiagnosisEdgesType = new GraphQLObjectType({
  name: 'DiagnosisEdgesType',
  fields: () => ({
    searchAfter: { type: jsonType },
    node: { type: DiagnosisType },
  }),
});

const DiagnosisHitsType = new GraphQLObjectType({
  name: 'DiagnosisHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(DiagnosisEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const DiagnosesType = new GraphQLObjectType({
  name: 'DiagnosesType',
  fields: () => ({
    hits: {
      type: DiagnosisHitsType,
      args: hitsArgsType,
      resolve: async parent => {
        const results = parent.diagnoses;
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

export default DiagnosesType;
