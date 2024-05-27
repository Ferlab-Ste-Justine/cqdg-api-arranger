import { esBiospecimenIndex } from '#src/config/env';
import { getBody } from '#src/services/elasticsearch/utils';

import { BiospecimenType } from './types/biospecimen';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esBiospecimenIndex, file_id });
  return body._source;
};

const getBy = async ({ field, value, path, args, context }) => {
  const isNested = Array.isArray(BiospecimenType.extensions?.nestedFields)
    ? BiospecimenType.extensions.nestedFields.includes(path)
    : false;
  const body = getBody({ field, value, path, nested: isNested });

  const res = await context.es.search({
    index: esBiospecimenIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map((hit) => hit._source) || [];
};

const BiospecimenModel = {
  get,
  getBy,
};

export default BiospecimenModel;
