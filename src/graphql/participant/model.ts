import { esParticipantIndex } from '../../config/env';
import { getBody } from '../../services/elasticsearch/utils';
import searchHits from '../common/searchHits';
import ParticipantType from './type';

const get = async (file_id, context) => {
  const { body } = await context.es.get({ index: esParticipantIndex, file_id });
  return body._source;
};

const getHits = async (first, sqon, sort, context) =>
  searchHits(context.es, sqon, sort, ParticipantType.extensions.nestedFields, {
    index: esParticipantIndex,
    size: first,
  });

const getBy = async ({ field, value, path, args, context }) => {
  const body = getBody({ field, value, path, nested: ParticipantType.extensions.nestedFields.includes(path) });

  const res = await context.es.search({
    index: esParticipantIndex,
    size: args.first,
    sort: args.sort,
    body,
  });

  const hits = res?.body?.hits?.hits || [];
  return hits.map(hit => hit._source) || [];
};

const ParticipantModel = {
  get,
  getHits,
  getBy,
};

export default ParticipantModel;
