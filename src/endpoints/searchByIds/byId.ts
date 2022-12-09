import { CONSTANTS } from '@arranger/middleware';
import get from 'lodash/get';

import { SetSqon } from '../sets/setsTypes';
import { SearchByIdsResult, SourceType } from './searchByIdsTypes';

const query = `query ($sqon: JSON, $size: Int, $offset: Int) {
  Participant {
    hits(filters: $sqon, first:$size, offset:$offset){
      edges {
        node {
          participant_id
        }
      }
    }
  }
}`;

const getSqon = (ids = []): SetSqon => ({
  op: CONSTANTS.OR_OP,
  content: [
    {
      op: CONSTANTS.IN_OP,
      content: {
        field: 'participant_id',
        value: ids,
      },
    },
  ],
});

const transform = (data: unknown, ids: string[]): SearchByIdsResult[] => {
  const participants = get(data, 'participant', []).filter(p => !!p);

  return ids.map(id => {
    const participantIds = participants
      .filter(participant => participant.participant_id === id || participant.external_id === id)
      .map(participant => participant.participant_id);

    return {
      search: id,
      type: 'PARTICIPANT',
      participantIds,
    };
  });
};

export const byId: SourceType = {
  query,
  getSqon,
  transform,
};
