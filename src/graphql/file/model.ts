import { esFileIndex } from '#src/config/env';
import { getBody } from '#src/services/elasticsearch/utils';

import { FileType } from './types/file';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esFileIndex, file_id });
  return body._source;
};

const getBy = async ({ field, value, path, args, context }) => {
  const isNested = Array.isArray(FileType.extensions?.nestedFields)
    ? FileType.extensions.nestedFields.includes(path)
    : false;
  const body = getBody({ field, value, path, nested: isNested });

  const res = await context.es.search({
    index: esFileIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  const sources = hits.map((hit) => hit._source);
  return sources;
};

const FileModel = {
  get,
  getBy,
};

export default FileModel;
