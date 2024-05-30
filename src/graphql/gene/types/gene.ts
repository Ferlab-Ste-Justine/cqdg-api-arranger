import { aggsResolver, columnStateResolver, hitsResolver } from '@ferlab/next/lib/common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  GraphQLJSON,
  hitsArgsType,
  MatchBoxStateType,
} from '@ferlab/next/lib/common/types';
import CommonGeneType, { extendedMapping, GeneAggType } from '@ferlab/next/lib/graphql/gene';
import { getFieldsFromType } from '@ferlab/next/lib/graphql/utils';
import { GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';

import { esGeneIndex } from '#src/config/env';

export const GeneType = new GraphQLObjectType({
  name: 'Gene',
  fields: () => ({
    ...getFieldsFromType(CommonGeneType),
  }),
  extensions: {
    ...CommonGeneType.extensions,
    esIndex: esGeneIndex,
  },
});

const GeneEdgesType = new GraphQLObjectType({
  name: 'GeneEdgesType',
  fields: () => ({
    searchAfter: { type: GraphQLJSON },
    node: { type: GeneType },
  }),
});

const GeneHitsType = new GraphQLObjectType({
  name: 'GeneHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(GeneEdgesType),
      resolve: async (parent, args) => parent.edges.map((node) => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const GenesType = new GraphQLObjectType({
  name: 'GenesType',
  fields: () => ({
    hits: {
      type: GeneHitsType,
      args: hitsArgsType,
      resolve: (parent, args, context) =>
        //todo: if parent add all parent.gene_ids in sqon to find genes by variant in gene index. Ask link between gene and variant
        hitsResolver(parent, args, GeneType, context.esClient),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: {
      type: ColumnsStateType,
      resolve: (_, args, context) => columnStateResolver(args, GeneType, context.esClient),
    },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: GeneAggType,
      args: aggregationsArgsType,
      resolve: (_, args, context, info) => aggsResolver(args, info, GeneType, context.esClient),
    },
  }),
});

export default GenesType;
