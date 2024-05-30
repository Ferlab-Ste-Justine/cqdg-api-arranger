import { aggsResolver, columnStateResolver, hitsResolver } from '@ferlab/next/lib/common/resolvers';
import {
  aggregationsArgsType,
  AggsStateType,
  ColumnsStateType,
  hitsArgsType,
  MatchBoxStateType,
} from '@ferlab/next/lib/common/types';
import GraphQLJSON from '@ferlab/next/lib/common/types/jsonType';
import { getFieldsFromType } from '@ferlab/next/lib/graphql/utils';
import CommonVariantType from '@ferlab/next/lib/graphql/variant';
import { VariantAggType } from '@ferlab/next/lib/graphql/variant';
import extendedMapping from '@ferlab/next/lib/graphql/variant/extendedMapping';
import { GraphQLInt, GraphQLList, GraphQLObjectType } from 'graphql';

import { esVariantIndex } from '#src/config/env';
import GenesType from '#src/graphql/gene';

export const VariantType = new GraphQLObjectType({
  name: 'Variant',
  fields: () => ({
    ...getFieldsFromType(CommonVariantType),
    genes: { type: GenesType, resolve: (parent) => parent.genes },
  }),
  extensions: {
    ...CommonVariantType.extensions,
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
      resolve: async (parent, args) => parent.edges.map((node) => ({ searchAfter: args?.searchAfter || [], node })),
    },
  }),
});

const VariantsType = new GraphQLObjectType({
  name: 'VariantsType',
  fields: () => ({
    hits: {
      type: VariantHitsType,
      args: hitsArgsType,
      resolve: (parent, args, context) => hitsResolver(parent, args, VariantType, context.esClient),
    },
    mapping: { type: GraphQLJSON },
    extended: {
      type: GraphQLJSON,
      resolve: () => extendedMapping,
    },
    aggsState: { type: AggsStateType },
    columnsState: {
      type: ColumnsStateType,
      resolve: (_, args, context) => columnStateResolver(args, VariantType, context.esClient),
    },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: {
      type: VariantAggType,
      args: aggregationsArgsType,
      resolve: (_, args, context, info) => aggsResolver(args, info, VariantType, context.esClient),
    },
  }),
});

export default VariantsType;
