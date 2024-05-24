import { esParticipantIndex } from 'src/config/env';
import { getBody } from 'src/services/elasticsearch/utils';

import { ParticipantType } from './types/participant';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esParticipantIndex, file_id });
  return body._source;
};

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: ParticipantType?.extensions?.nestedFields?.includes(path) });

  const res = await context.es.search({
    index: esParticipantIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map((hit) => hit._source) || [];
};

const ParticipantModel = {
  get,
  getBy,
};

export default ParticipantModel;
