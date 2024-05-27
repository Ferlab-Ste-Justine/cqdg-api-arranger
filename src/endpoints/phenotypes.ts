import { SetSqon } from '@ferlab/next/lib/sets/types';
import searchSqon from '@ferlab/next/lib/sqon/searchSqon';
import { replaceSetByIds } from '@ferlab/next/lib/sqon/setSqon';
import get from 'lodash/get';

import schema from '#src/graphql/schema';
import esClient from '#src/services/elasticsearch/client';

import { participantBiospecimenKey, participantFileKey, participantKey } from '../config/env';
import { maxSetContentSize, participantIdKey, usersApiURL } from '../config/env';
import runQuery from '../graphql/runQuery';

const getPathToParticipantId = (type: string) => {
  if (type === 'biospecimen') {
    return participantBiospecimenKey;
  } else if (type === 'file') {
    return participantFileKey;
  } else {
    return participantKey;
  }
};

export const getPhenotypesNodes = async (
  sqon: SetSqon,
  type: string,
  aggregations_filter_themselves: boolean,
  accessToken: string
) => {
  const newSqon = await replaceSetByIds(sqon, accessToken, getPathToParticipantId, usersApiURL);
  const participantIds = await searchSqon(
    newSqon,
    'Participant',
    [],
    participantIdKey,
    esClient,
    schema,
    maxSetContentSize
  );
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
