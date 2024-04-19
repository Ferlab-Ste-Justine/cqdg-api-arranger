import get from 'lodash/get';

import { maxSetContentSize, participantIdKey } from '../config/env';
import runQuery from '../graphql/runQuery';
import { searchSqon } from '../sqon/searchSqon';
import { replaceSetByIds } from '../sqon/setSqon';
import { SetSqon } from './sets/setsTypes';

const getParticipantIds = async (sqon: SetSqon) => await searchSqon(sqon, 'Participant', [], participantIdKey);

export const getPhenotypesNodes = async (
  sqon: SetSqon,
  type: string,
  aggregations_filter_themselves: boolean,
  accessToken: string,
) => {
  const newSqon = await replaceSetByIds(sqon, accessToken);
  const participantIds = await getParticipantIds(newSqon);
  return getPhenotypesNodesByIds(participantIds, type, aggregations_filter_themselves);
};

const getPhenotypesNodesByIds = async (ids: string[], type: string, aggregations_filter_themselves: boolean) => {
  const query = `query($sqon: JSON, $term_filters: JSON) {
    Participant {
      aggregations(filters: $sqon, aggregations_filter_themselves: ${aggregations_filter_themselves}) {
        ${type}__name {
          buckets {
            key
            doc_count
            top_hits(_source: ["${type}.parents"], size: 1)
            filter_by_term(filter: $term_filters)
          }
        }
      }
    }
  }`;

  const sqon = {
    content: [
      {
        content: {
          field: participantIdKey,
          value: ids,
          index: 'Participant',
        },
        op: 'in',
      },
    ],
    op: 'and',
  };

  const termFilter = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: `${type}.is_tagged`,
          value: [true],
        },
      },
    ],
  };

  const variables = { sqon, term_filters: termFilter, size: maxSetContentSize, offset: 0 };

  const results = await runQuery({
    query,
    variables,
  });

  if (results?.errors) {
    console.error('[getPhenotypesNodesByIds]', results.errors?.[0] || results.errors);
  }

  return get(results, `data.Participant.aggregations.${type}__name.buckets`, []);
};
