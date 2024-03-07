import { esStudyIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { StudyType } from './types/study';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esStudyIndex, file_id });
  return body._source;
};

const getBy = async ({ field, value, path, args, context }) => {
  const isNested = Array.isArray(StudyType.extensions?.nestedFields)
    ? StudyType.extensions.nestedFields.includes(path)
    : false;
  const body = getBody({ field, value, path, nested: isNested });

  const res = await context.es.search({
    index: esStudyIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const StudyModel = {
  get,
  getBy,
};

export default StudyModel;
