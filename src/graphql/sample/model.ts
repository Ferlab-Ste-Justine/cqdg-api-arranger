import { esBiospecimenIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import searchHits from '../common/searchHits';
import SampleType from './type';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esBiospecimenIndex, file_id });
  return body._source;
};

const getHits = async (first, sqon, sort, context) =>
  searchHits(context.es, sqon, sort, SampleType.extensions.nestedFields, {
    index: esBiospecimenIndex,
    size: first,
  });

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: SampleType.extensions.nestedFields.includes(path) });

  const res = await context.es.search({
    index: esBiospecimenIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const SampleModel = {
  get,
  getHits,
  getBy,
};

export default SampleModel;
