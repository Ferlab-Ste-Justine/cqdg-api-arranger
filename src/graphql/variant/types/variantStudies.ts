import { aggregationsType, AggsStateType, ColumnsStateType, MatchBoxStateType } from '@ferlab/next/lib/common/types';
import { GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString } from 'graphql';

import { totalType } from './frequencies';
import GraphQLJSON from './variant';

/** way of have hits.edges.node all combined in one const type */
export const VariantStudiesType = new GraphQLObjectType({
  name: 'VariantStudiesType',
  fields: () => ({
    hits: {
      type: new GraphQLObjectType({
        name: 'VariantStudyHitsType',
        fields: () => ({
          total: { type: GraphQLInt },
          edges: {
            type: new GraphQLList(
              new GraphQLObjectType({
                name: 'VariantStudyEdgesType',
                fields: () => ({
                  searchAfter: { type: new GraphQLList(GraphQLInt) },
                  node: {
                    type: new GraphQLObjectType({
                      name: 'VariantStudyType',
                      fields: () => ({
                        id: { type: GraphQLString },
                        study_code: { type: GraphQLString },
                        study_id: { type: GraphQLString },
                        transmission: { type: new GraphQLList(GraphQLString) },
                        zygosity: { type: new GraphQLList(GraphQLString) },
                        total: { type: totalType },
                      }),
                    }),
                  },
                }),
              })
            ),
            resolve: async (parent, args) =>
              parent.edges.map((node) => ({
                searchAfter: args?.searchAfter || [],
                node,
              })),
          },
        }),
      }),
      resolve: async (parent) => {
        const results = parent.studies;
        return { total: results?.length || 0, edges: results || [] };
      },
    },
    mapping: { type: GraphQLJSON },
    extended: { type: GraphQLJSON },
    aggsState: { type: AggsStateType },
    columnsState: { type: ColumnsStateType },
    matchBoxState: { type: MatchBoxStateType },
    aggregations: { type: aggregationsType },
  }),
});

export default VariantStudiesType;
