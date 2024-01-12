import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { hitsArgsType, hitsOthersFields } from '../../common/types';

const CosmicType = new GraphQLObjectType({
  name: 'CosmicType',
  fields: () => ({
    tumour_types_germline: { type: GraphQLString },
  }),
});

const CosmicEdgesType = new GraphQLObjectType({
  name: 'CosmicEdgesType',
  fields: () => ({
    searchAfter: { type: new GraphQLList(GraphQLInt) },
    node: { type: CosmicType },
  }),
});

const CosmicHitsType = new GraphQLObjectType({
  name: 'CosmicHitsType',
  fields: () => ({
    total: { type: GraphQLInt },
    edges: {
      type: new GraphQLList(CosmicEdgesType),
      resolve: async parent => parent.edges.map(node => ({ searchAfter: [], node })),
    },
  }),
});

const CosmicsType = new GraphQLObjectType({
  name: 'CosmicsType',
  fields: () => ({
    hits: {
      type: CosmicHitsType,
      args: hitsArgsType,
      resolve: async parent => {
        const results = parent.cosmic;
        return { total: results?.length || 0, edges: results || [] };
      },
    },
    ...hitsOthersFields,
  }),
});

export default CosmicsType;
