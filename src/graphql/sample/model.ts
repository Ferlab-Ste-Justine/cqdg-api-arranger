import { esBiospecimenIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import { SampleType } from './types/sample';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esBiospecimenIndex, file_id });
  return body._source;
};

const getBy = async ({ field, value, path, args, context }) => {
  const isNested = Array.isArray(SampleType.extensions?.nestedFields)
    ? SampleType.extensions.nestedFields.includes(path)
    : false;
  const body = getBody({ field, value, path, nested: isNested });

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
  getBy,
};

export default SampleModel;
