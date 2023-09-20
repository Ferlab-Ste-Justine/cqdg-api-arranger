import get from 'lodash/get';

import { maxSetContentSize, participantIdKey } from '../config/env';
import { ArrangerProject, searchSqon } from '../sqon/searchSqon';
import { replaceSetByIds } from '../sqon/setSqon';
import { SetSqon } from './sets/setsTypes';

const getParticipantIds = async (
  sqon: SetSqon,
  projectId: string,
  getProject: (projectId: string) => ArrangerProject,
) => await searchSqon(sqon, projectId, 'Participant', [], participantIdKey, getProject);

export const getPhenotypesNodes = async (
  sqon: SetSqon,
  projectId: string,
  getProject: (projectId: string) => ArrangerProject,
  type: string,
  aggregations_filter_themselves: boolean,
  accessToken: string,
  userId: string,
) => {
  const newSqon = await replaceSetByIds(sqon, accessToken, userId);
  const participantIds = await getParticipantIds(newSqon as SetSqon, projectId, getProject);
  return getPhenotypesNodesByIds(participantIds, projectId, getProject, type, aggregations_filter_themselves);
};

const getPhenotypesNodesByIds = async (
  ids: string[],
  projectId: string,
  getProject: (projectId: string) => ArrangerProject,
  type: string,
  aggregations_filter_themselves: boolean,
) => {
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

  const project = getProject(projectId);
  if (!project) {
    throw new Error(`ProjectID '${projectId}' cannot be established.`);
  }

  const variables = { sqon, term_filters: termFilter, size: maxSetContentSize, offset: 0 };

  const res = await project.runQuery({
    query,
    variables,
  });

  return get(res, `data.Participant.aggregations.${type}__name.buckets`, []);
};
