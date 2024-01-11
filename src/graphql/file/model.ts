import { esFileIndex } from '../../config/env';
import searchHits from '../common/searchHits';
import FileType from './type';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esFileIndex, file_id });
  return body._source;
};

const getHits = async (first, sqon, sort, context) =>
  searchHits(context.es, sqon, sort, FileType.extensions.nestedFields as any, {
    index: esFileIndex,
    size: first,
  });

const getBy = async ({ field, value, path, args, context }) => {
  const body = {
    query: {
      bool: {
        must: [
          {
            nested: {
              path,
              query: { bool: { must: [{ match: { [field]: value } }] } },
            },
          },
        ],
      },
    },
  };

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
