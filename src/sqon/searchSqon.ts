import get from 'lodash/get';

import { maxSetContentSize } from '../config/env';
import { SetSqon, Sort } from '../endpoints/sets/setsTypes';
import runQuery from '../graphql/runQuery';

export const searchSqon = async (sqon: SetSqon, type: string, sort: Sort[], idField: string): Promise<string[]> => {
  const results = await runQuery({
    query: `
      query($sqon: JSON, $sort: [Sort], $first: Int) {
        ${type} {
          hits(filters: $sqon, sort: $sort, first: $first) {
            edges {
              node {
                ${idField}
              }
            }
          }
        }
      }
    `,
    variables: { sqon, sort, first: maxSetContentSize },
  });

  if (get(results, 'errors', undefined)) {
    throw new Error(get(results, 'errors', undefined));
  }

  return get(results, `data.${type}.hits.edges`, []).map(edge => edge.node[idField]);
};
