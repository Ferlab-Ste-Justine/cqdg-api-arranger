import { esFileIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { searchHits } from '../elasticsearch';
import FileType from './type';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esFileIndex, file_id });
  return body._source;
};

const getHits = async ({ first, offset, sqon, sort, searchAfter, context }) => {
  const searchParams = {
    index: esFileIndex,
    size: first,
    searchAfter,
    offset,
  };
  const nestedFields = FileType.extensions.nestedFields || [];
  return searchHits({
    es: context.es,
    sqon,
    sort,
    nestedFields,
    searchParams,
  });
};

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: FileType?.extensions?.nestedFields?.includes(path) });

  const res = await context.es.search({
    index: esFileIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  const sources = hits.map(hit => hit._source);
  return sources;
};

const FileModel = {
  get,
  getHits,
  getBy,
};

export default FileModel;
