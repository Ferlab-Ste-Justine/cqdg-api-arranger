import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import Biospecimen from './biospecimen/query';
import File from './file/query';
import Gene from './gene/query';
import Participant from './participant/query';
import Study from './study/query';
import Variant from './variant/query';

//could have mutation as well
//const mutation = new GraphQLObjectType({
//   name: 'Mutation',

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    File,
    Gene,
    Participant,
    Study,
    Variant,
    Biospecimen,
  },
});

const schema = new GraphQLSchema({
  query,
});

export default schema;
