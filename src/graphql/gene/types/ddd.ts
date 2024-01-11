import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { hitsArgsType, hitsOthersFields } from '../../common/types';

const DddType = new GraphQLObjectType({
  name: 'DddType',
  fields: () => ({
    disease_name: { type: GraphQLString },
  }),
});

const DddEdgesType = new GraphQLObjectType({
  name: 'DddEdgesType',
  fields: () => ({
    searchAfter: { type: new GraphQLList(GraphQLInt) },
    node: { type: DddType },
  }),
});

const DddHitsType = new GraphQLObjectType({
  name: 'DddHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(DddEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const DddsType = new GraphQLObjectType({
  name: 'DddsType',
  fields: () => ({
    hits: {
      type: DddHitsType,
      args: hitsArgsType,
      resolve: async parent => {
        const results = parent.ddd;
        return { total: results?.length || 0, edges: results || [] };
      },
    },
    ...hitsOthersFields,
  }),
});

export default DddsType;
