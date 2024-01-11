import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { aggregationsType, AggsStateType, ColumnsStateType, hitsArgsType, MatchBoxStateType } from '../../common/types';
import GeneType from '../../gene/types/gene';
import VariantModel from '../model';
import { frequenciesType } from './frequencies';
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
    genes: { type: new GraphQLList(GeneType) },
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

const VariantHitsType = new GraphQLObjectType({
  name: 'VariantHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(VariantEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const VariantsType = new GraphQLObjectType({
  name: 'VariantsType',
  fields: () => ({
    hits: {
      type: VariantHitsType,
      args: hitsArgsType,
      resolve: async (parent, args, context) => {
        const results = await VariantModel.getHits(args.first, args.sqon, args.sort, context);
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

export default VariantsType;
