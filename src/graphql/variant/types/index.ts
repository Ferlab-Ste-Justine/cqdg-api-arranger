import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';
import GenesType from '../../gene/types';
import { aggResolver, hitsResolver } from '../resolvers';
import { frequenciesType } from './frequencies';
import VariantAggType from './variantAggType';
import VariantStudiesType from './variantStudies';

const ClinvarType = new GraphQLObjectType({
  name: 'ClinvarType',
  fields: () => ({
    clinvar_id: { type: GraphQLString },
    clin_sig: { type: new GraphQLList(GraphQLString) },
    conditions: { type: new GraphQLList(GraphQLString) },
    inheritance: { type: new GraphQLList(GraphQLString) },
    interpretations: { type: new GraphQLList(GraphQLString) },
  }),
});

const VariantType = new GraphQLObjectType({
  name: 'Variant',
  fields: () => ({
    id: { type: GraphQLString },
    studies: { type: VariantStudiesType },
    genes: { type: GenesType },
    alternate: { type: GraphQLString },
    assembly_version: { type: GraphQLString },
    chromosome: { type: GraphQLString },
    dna_change: { type: GraphQLString },
    end: { type: GraphQLFloat },
    gene_external_reference: { type: new GraphQLList(GraphQLString) },
    hash: { type: GraphQLString },
    hgvsg: { type: GraphQLString },
    locus: { type: GraphQLString },
    max_impact_score: { type: GraphQLFloat },
    reference: { type: GraphQLString },
    rsnumber: { type: GraphQLString },
    sources: { type: new GraphQLList(GraphQLString) },
    start: { type: GraphQLFloat },
    variant_class: { type: GraphQLString },
    variant_external_reference: { type: new GraphQLList(GraphQLString) },
    clinvar: { type: ClinvarType },
    // cmc: { type: VariantCmc },
    external_frequencies: { type: frequenciesType },
    internal_frequencies_wgs: { type: new GraphQLList(frequenciesType) },
  }),
  extensions: {
    nestedFields: ['genes', 'studies'],
  },
});

const VariantEdgesType = new GraphQLObjectType({
  name: 'VariantEdgesType',
  fields: () => ({
    searchAfter: { type: new GraphQLList(GraphQLInt) },
    node: { type: VariantType },
  }),
});

export const VariantHitsType = new GraphQLObjectType({
  name: 'VariantHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(VariantEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const extendedType = new GraphQLObjectType({
  name: 'extendedType',
  fields: () => ({
    unit: { type: GraphQLString },
    displayValues: { type: GraphQLJSON },
    quickSearchEnabled: { type: GraphQLBoolean },
    field: { type: GraphQLString },
    displayName: { type: GraphQLString },
    active: { type: GraphQLBoolean },
    isArray: { type: GraphQLBoolean },
    rangeStep: { type: GraphQLInt },
    type: { type: GraphQLString },
    gqlId: { type: GraphQLString },
    primaryKey: { type: GraphQLBoolean },
  }),
});

const VariantsType = new GraphQLObjectType({
  name: 'VariantsType',
  fields: () => ({
    hits: {
      type: VariantHitsType,
      args: hitsArgsType,
      resolve: hitsResolver,
    },
    mapping: { type: GraphQLString },
    extended: {
      type: GraphQLJSON,
      //todo: test in progress
      resolve: () => [
        {
          unit: null,
          displayValues: {},
          quickSearchEnabled: false,
          field: 'studies',
          displayName: 'Studies',
          active: false,
          isArray: false,
          rangeStep: 1,
          type: 'nested',
          gqlId: 'cqdg::Variant::extended::studies',
          primaryKey: false,
        },
      ],
    },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: VariantAggType,
      args: aggregationsArgsType,
      resolve: aggResolver,
    },
  }),
});

export default VariantsType;
