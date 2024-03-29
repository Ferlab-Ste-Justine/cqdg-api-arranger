import SQS from 'aws-sdk/clients/sqs';
import difference from 'lodash/difference';
import dropRight from 'lodash/dropRight';
import union from 'lodash/union';

import { maxSetContentSize, sendUpdateToSqs } from '../../config/env';
import {
  EventCreate,
  EventCreateValue,
  EventDelete,
  EventDeleteValues,
  EventUpdate,
  UpdateContentValue,
  UpdateTagValue,
} from '../../services/SQS/eventTypes';
import { sendSetInSQSQueue } from '../../services/SQS/sendEvent';
import { CreateUpdateBody, Output } from '../../services/usersApi';
import { deleteUserContent, getUserContents, postUserContent, putUserContent } from '../../services/usersApi';
import { addSqonToSetSqon, removeSqonToSetSqon } from '../../sqon/manipulateSqon';
import { resolveSetsInSqon } from '../../sqon/resolveSetInSqon';
import { ArrangerProject, searchSqon } from '../../sqon/searchSqon';
import { SetNotFoundError } from './setError';
import { CreateSetBody, Set, UpdateSetContentBody, UpdateSetTagBody } from './setsTypes';

export const SubActionTypes = {
  RENAME_TAG: 'RENAME_TAG',
  ADD_IDS: 'ADD_IDS',
  REMOVE_IDS: 'REMOVE_IDS',
};

const ActionTypes = {
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
};

export const getUserSet = async (accessToken: string, userId: string, setId: string): Promise<Output> => {
  const existingSetsFilterById = (await getUserContents(accessToken)).filter(r => r.id === setId);

  if (existingSetsFilterById.length !== 1) {
    throw new SetNotFoundError('Set to update can not be found !');
  }

  return existingSetsFilterById[0];
};

export const getSets = async (accessToken: string): Promise<Set[]> => {
  const userContents = await getUserContents(accessToken);
  return userContents.map(set => mapResultToSet(set));
};

export const createSet = async (
  requestBody: CreateSetBody,
  accessToken: string,
  userId: string,
  sqs: SQS,
  getProject: (projectId: string) => ArrangerProject,
): Promise<Set> => {
  const { sqon, sort, projectId, type, idField, tag } = requestBody;
  const sqonAfterReplace = await resolveSetsInSqon(sqon, userId, accessToken);
  const ids = await searchSqon(sqonAfterReplace, projectId, type, sort, idField, getProject);

  const truncatedIds = truncateIds(ids);

  const payload = {
    alias: tag,
    sharedPublicly: false,
    content: { ids: truncatedIds, setType: type, sqon, sort, idField },
  } as CreateUpdateBody;

  if (!payload.alias || !payload.content.ids) {
    throw Error(`Set must have ${!payload.alias ? 'a name' : 'no set ids'}`);
  }
  const createResult = await postUserContent(accessToken, payload);

  const setResult: Set = mapResultToSet(createResult);

  if (sendUpdateToSqs && createResult.alias) {
    await sendSetInSQSQueue(sqs, {
      actionType: ActionTypes.CREATE,
      values: {
        userId,
        setId: createResult.id,
        ids: truncatedIds,
        size: truncatedIds.length,
        sqon,
        path: idField,
        type,
        tag,
        createdAt: createResult.creationDate,
      } as EventCreateValue,
    } as EventCreate);
  }
  return setResult;
};

export const updateSetTag = async (
  requestBody: UpdateSetTagBody,
  accessToken: string,
  userId: string,
  setId: string,
  sqs: SQS,
): Promise<Set> => {
  const setToUpdate = await getUserSet(accessToken, userId, setId);

  const payload = {
    alias: requestBody.newTag,
    sharedPublicly: setToUpdate.sharedPublicly,
    content: setToUpdate.content,
  } as CreateUpdateBody;

  const updateResult = await putUserContent(accessToken, payload, setId);

  const setResult: Set = mapResultToSet(updateResult);

  if (sendUpdateToSqs && updateResult.alias) {
    await sendSetInSQSQueue(sqs, {
      actionType: ActionTypes.UPDATE,
      subActionType: requestBody.subAction,
      values: { userId, setId, newTag: updateResult.alias } as UpdateTagValue,
    } as EventUpdate);
  }

  return setResult;
};

export const updateSetContent = async (
  requestBody: UpdateSetContentBody,
  accessToken: string,
  userId: string,
  setId: string,
  sqs: SQS,
  getProject: (projectId: string) => ArrangerProject,
): Promise<Set> => {
  const setToUpdate = await getUserSet(accessToken, userId, setId);

  const { sqon, ids, setType } = setToUpdate.content;

  const sqonAfterReplace = await resolveSetsInSqon(requestBody.sqon, userId, accessToken);

  const newSqonIds = await searchSqon(
    sqonAfterReplace,
    requestBody.projectId,
    setToUpdate.content.setType,
    setToUpdate.content.sort,
    setToUpdate.content.idField,
    getProject,
  );

  if (setType !== setToUpdate.content.setType) {
    throw new Error('Cannot add/remove from a set not of the same type');
  }

  const existingSqonWithNewSqon =
    requestBody.subAction === SubActionTypes.ADD_IDS
      ? addSqonToSetSqon(sqon, requestBody.sqon)
      : removeSqonToSetSqon(sqon, requestBody.sqon);

  const existingIdsWithNewIds =
    requestBody.subAction === SubActionTypes.ADD_IDS ? union(ids, newSqonIds) : difference(ids, newSqonIds);
  const truncatedIds = truncateIds(existingIdsWithNewIds);

  const payload = {
    alias: setToUpdate.alias,
    sharedPublicly: setToUpdate.sharedPublicly,
    content: { ...setToUpdate.content, sqon: existingSqonWithNewSqon, ids: truncatedIds },
  } as CreateUpdateBody;

  const updateResult = await putUserContent(accessToken, payload, setId);

  const setResult: Set = mapResultToSet(updateResult);

  if (sendUpdateToSqs && updateResult.alias) {
    await sendSetInSQSQueue(sqs, {
      actionType: ActionTypes.UPDATE,
      subActionType: requestBody.subAction,
      values: {
        userId,
        setId,
        tag: updateResult.alias,
        ids: truncatedIds,
        createdAt: updateResult.creationDate,
      } as UpdateContentValue,
    } as EventUpdate);
  }
  return setResult;
};

export const deleteSet = async (accessToken: string, setId: string, userId: string, sqs: SQS): Promise<boolean> => {
  const deleteResult = await deleteUserContent(accessToken, setId);

  if (sendUpdateToSqs) {
    await sendSetInSQSQueue(sqs, {
      actionType: ActionTypes.DELETE,
      values: { setIds: [setId], userId } as EventDeleteValues,
    } as EventDelete);
  }

  return deleteResult;
};

const mapResultToSet = (output: Output): Set => ({
  id: output.id,
  tag: output.alias,
  size: output.content.ids.length,
  updated_date: output.updated_date,
  setType: output.content.setType,
  ids: output.content.ids,
});

const truncateIds = (ids: string[]): string[] => {
  if (ids.length <= maxSetContentSize) {
    return ids;
  }
  return dropRight(ids, ids.length - maxSetContentSize);
};
