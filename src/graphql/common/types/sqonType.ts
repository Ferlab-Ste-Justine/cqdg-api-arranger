import { GraphQLEnumType, GraphQLInputObjectType, GraphQLList, GraphQLString } from 'graphql';

const OpType = new GraphQLEnumType({
  name: 'OpType',
  description: '',
  values: {
    //TODO get from arranger mappings
    in: { value: 'in' },
    or: { value: 'or' },
    and: { value: 'and' },
  },
});

const ContentType = new GraphQLInputObjectType({
  name: 'ContentType',
  fields: {
    field: { type: GraphQLString },
    value: { type: new GraphQLList(GraphQLString) },
  },
});

const SqonElementType = new GraphQLInputObjectType({
  name: 'SqonElement',
  fields: {
    content: { type: ContentType },
    op: { type: OpType },
  },
});

export const RootSqonType = new GraphQLInputObjectType({
  name: 'Sqon',
  fields: () => ({
    content: { type: new GraphQLList(SqonElementType) },
    op: { type: OpType },
  }),
});
