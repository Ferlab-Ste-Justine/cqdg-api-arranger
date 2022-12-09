import { CONSTANTS } from '@arranger/middleware';
import get from 'lodash/get';

import { SetSqon } from '../sets/setsTypes';
import { SearchByIdsResult, SourceType } from './searchByIdsTypes';

//todo: check for issue bio on parti
const query = `query ($sqon: JSON, $size: Int, $offset: Int) {
  Participant {
    hits (filters: $sqon, first:$size, offset:$offset){
      edges {
        node {
          participant_id
          biospecimens {
            hits {
              edges {
                node {
                  external_sample_id   
                }
              }
            }
          }
        }
      }
    }
  }
}`;

const getSqon = (ids = []): SetSqon => ({
  op: CONSTANTS.AND_OP,
  content: [
    {
      op: CONSTANTS.IN_OP,
      content: {
        field: 'biospecimens.external_sample_id',
        value: ids,
      },
    },
  ],
});

const transform = (data: unknown, ids: string[]): SearchByIdsResult[] => {
  const participants = get(data, 'participant', []).filter(p => !!p);

  return ids.map(id => {
    const participantIds = participants
      .filter(participant => {
        const biospecimens = get(participant, 'biospecimens', []);
        return biospecimens.some(bio => bio.external_sample_id === id);
      })
      .map(participant => participant.participant_id);

    return {
      search: id,
      type: 'SAMPLE EXTERNAL ID',
      participantIds,
    };
  });
};

export const bySampleExternalId: SourceType = {
  query,
  getSqon,
  transform,
};
