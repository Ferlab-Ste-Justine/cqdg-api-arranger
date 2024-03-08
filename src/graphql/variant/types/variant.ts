import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { esVariantIndex } from '../../../config/env';
import { aggsResolver, hitsResolver } from '../../common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '../../common/types';
import GraphQLJSON from '../../common/types/jsonType';
import GenesType from '../../gene/types/gene';
import StudiesType from '../../study/types/study';
import extendedMapping from '../extendedMapping';
import { frequenciesType } from './frequencies';
import VariantAggType from './variantAgg';
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

const CmcType = new GraphQLObjectType({
  name: 'CmcType',
  fields: () => ({
    cosmic_id: { type: GraphQLString },
    mutation_url: { type: GraphQLString },
    sample_mutated: { type: GraphQLFloat },
    sample_ratio: { type: GraphQLFloat },
    sample_tested: { type: GraphQLFloat },
    shared_aa: { type: GraphQLFloat },
    tier: { type: GraphQLString },
  }),
});

export const VariantType = new GraphQLObjectType({
  name: 'Variant',
  fields: () => ({
    id: { type: GraphQLString },
    studies: { type: StudiesType },
    genes: { type: GenesType, resolve: parent => parent.genes },
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
    cmc: { type: CmcType },
    external_frequencies: { type: frequenciesType },
    internal_frequencies_wgs: { type: frequenciesType },
    study_frequencies_wgs: { type: StudiesType, resolve: parent => parent.study_frequencies_wgs },
  }),
  extensions: {
    nestedFields: ['genes', 'studies'],
    esIndex: esVariantIndex,
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
      resolve: async (parent, args) => parent.edges.map(node => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const VariantsType = new GraphQLObjectType({
  name: 'VariantsType',
  fields: () => ({
    hits: {
      type: VariantHitsType,
      args: hitsArgsType,
      resolve: (parent, args) => hitsResolver(args, VariantType),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: VariantAggType,
      args: aggregationsArgsType,
      resolve: (parent, args, context, info) => aggsResolver(args, info, VariantType),
    },
  }),
});

export default VariantsType;
