import { CONSTANTS as ARRANGER_CONSTANTS } from '@arranger/middleware';
import { GraphQLEnumType, GraphQLInputObjectType, GraphQLList, GraphQLString } from 'graphql';

const OpType = new GraphQLEnumType({
  name: 'OpType',
  description: '',
  values: {
    in: { value: ARRANGER_CONSTANTS.in },
    or: { value: ARRANGER_CONSTANTS.or },
    and: { value: ARRANGER_CONSTANTS.and },
  },
});

const SqonContentType = new GraphQLInputObjectType({
  name: 'SqonContentType',
  fields: () => ({
    field: { type: GraphQLString },
    value: { type: new GraphQLList(GraphQLString) },
  }),
});

const SqonElementType = new GraphQLInputObjectType({
  name: 'SqonElement',
  fields: () => ({
    content: { type: SqonContentType },
    op: { type: OpType },
  }),
});

export const RootSqonType = new GraphQLInputObjectType({
  name: 'Sqon',
  fields: () => ({
    content: { type: new GraphQLList(SqonElementType) },
    op: { type: OpType },
  }),
});
