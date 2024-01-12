//FIXME https://github.com/robrichard/graphql-fields#deprecation-notice
import getFields from 'graphql-fields';

export const getGQLFields = resolveInfo => getFields(resolveInfo, {}, { processArguments: true });
