import { GraphQLBoolean, GraphQLFloat, GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import {
  aggregationsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  jsonType,
  MatchBoxStateType,
} from '../../common/types';
import GeneModel from '../model';
import CosmicsType from './cosmic';
import DddsType from './ddd';

const ConsequenceType = new GraphQLObjectType({
  name: 'Consequence',
  fields: () => ({
    vep_impact: { type: GraphQLString },
    consequence: { type: new GraphQLList(GraphQLString) },
    picked: { type: GraphQLBoolean },
  }),
});

const GeneType = new GraphQLObjectType({
  name: 'Gene',
  fields: () => ({
    id: { type: GraphQLString },
    alias: { type: new GraphQLList(GraphQLString) },
    biotype: { type: GraphQLString },
    chromosome: { type: GraphQLString },
    ensembl_gene_id: { type: GraphQLString },
    entrez_gene_id: { type: GraphQLFloat },
    hash: { type: GraphQLString },
    hgnc: { type: GraphQLString },
    location: { type: GraphQLString },
    name: { type: GraphQLString },
    omim_gene_id: { type: GraphQLString },
    search_text: { type: GraphQLString },
    symbol: { type: GraphQLString },
    consequences: { type: new GraphQLList(ConsequenceType) },
    cosmic: { type: CosmicsType },
    ddd: { type: DddsType },
    gnomad: {
      type: new GraphQLObjectType({
        name: 'GeneGnomad',
        fields: () => ({
          loeuf: { type: GraphQLFloat },
          pli: { type: GraphQLFloat },
        }),
      }),
    },
    //todo hpo omim orpha
    hpo: { type: GraphQLString },
    omim: { type: GraphQLString },
    orphanet: { type: GraphQLString },
  }),
});

const GeneEdgesType = new GraphQLObjectType({
  name: 'GeneEdgesType',
  fields: () => ({
    searchAfter: { type: jsonType },
    node: { type: GeneType },
  }),
});

const GeneHitsType = new GraphQLObjectType({
  name: 'GeneHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(GeneEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const GenesType = new GraphQLObjectType({
  name: 'GenesType',
  fields: () => ({
    hits: {
      type: GeneHitsType,
      args: hitsArgsType,
      resolve: async (parent, args, context) => {
        const results = await GeneModel.getHits(args.first, args.sqon, args.sort, context);
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
export default GenesType;
