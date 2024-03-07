import { Client } from '@elastic/elasticsearch';
import filesize from 'filesize';

import {
  addCagCount,
  biospecimenIdKey,
  cagBiospecimensCount,
  cagFilesCount,
  cagFilesSize,
  cagParticipantsCount,
  esBiospecimenIndex,
  esFileIndex,
  esParticipantIndex,
  esStudyIndex,
  esVariantIndex,
  fileIdKey,
  indexNameGeneFeatureSuggestion,
  indexNameVariantFeatureSuggestion,
  maxNOfGenomicFeatureSuggestions,
  participantIdKey,
  studyIdKey,
  variantIdKey,
} from '../../config/env';
import { SUGGESTIONS_TYPES } from '../../endpoints/genomicFeatureSuggestions';
import client from './client';

export const fetchFileStats = async (): Promise<number> => {
  try {
    const { body } = await client.search({
      index: esFileIndex,
      body: { aggs: { types_count: { value_count: { field: fileIdKey } } } },
      size: 0,
    });
    let filesCount = body?.aggregations?.types_count.value;
    if (addCagCount) {
      filesCount += cagFilesCount;
    }
    return filesCount;
  } catch (error) {
    console.log('[fetchFileStats] error: ', error);
    return null;
  }
};

export const fetchFileSizeStats = async (): Promise<string> => {
  try {
    const { body } = await client.search({
      index: esFileIndex,
      body: { aggs: { types_count: { sum: { field: 'file_size' } } } },
      size: 0,
    });
    let filesSize = body?.aggregations?.types_count.value;
    if (addCagCount) {
      filesSize += cagFilesSize;
    }
    return filesize(filesSize).replace(' ', '');
  } catch (error) {
    console.log('[fetchFileSizeStats] error: ', error);
    return null;
  }
};

export const fetchStudyStats = async (): Promise<number> => {
  try {
    const { body } = await client.search({
      index: esStudyIndex,
      body: { aggs: { types_count: { value_count: { field: studyIdKey } } } },
      size: 0,
    });
    return body?.aggregations?.types_count.value;
  } catch (error) {
    console.log('[fetchStudyStats] error: ', error);
    return null;
  }
};

export const fetchParticipantStats = async (): Promise<number> => {
  try {
    const { body } = await client.search({
      index: esParticipantIndex,
      body: { aggs: { types_count: { value_count: { field: participantIdKey } } } },
      size: 0,
    });
    let participantsCount = body?.aggregations?.types_count.value;
    if (addCagCount) {
      participantsCount += cagParticipantsCount;
    }
    return participantsCount;
  } catch (error) {
    console.log('[fetchParticipantStats] error: ', error);
    return null;
  }
};

export const fetchBiospecimenStats = async (): Promise<number> => {
  try {
    const { body } = await client.search({
      index: esBiospecimenIndex,
      body: { aggs: { types_count: { value_count: { field: biospecimenIdKey } } } },
      size: 0,
    });
    let biospecimensCount = body?.aggregations?.types_count.value;
    if (addCagCount) {
      biospecimensCount += cagBiospecimensCount;
    }
    return biospecimensCount;
  } catch (error) {
    console.log('[fetchBiospecimenStats] error: ', error);
    return null;
  }
};

export const fetchVariantStats = async (): Promise<number> => {
  try {
    const { body } = await client.search({
      index: esVariantIndex,
      body: { aggs: { types_count: { value_count: { field: variantIdKey } } } },
      size: 0,
    });
    return body?.aggregations?.types_count.value;
  } catch (error) {
    console.log('[fetchVariantStats] error: ', error);
    return null;
  }
};

export const fetchGenomicFeatureSuggestions = async (prefix: string, type: string): Promise<any> => {
  try {
    const _index = type === SUGGESTIONS_TYPES.GENE ? indexNameGeneFeatureSuggestion : indexNameVariantFeatureSuggestion;
    const { body } = await client.search({
      index: _index,
      body: {
        suggest: {
          suggestions: {
            prefix,
            completion: {
              field: 'suggest',
              size: maxNOfGenomicFeatureSuggestions,
            },
          },
        },
      },
    });
    return body?.suggest?.suggestions[0];
  } catch (error) {
    console.log('[fetchGenomicFeatureSuggestions] error: ', error);
    return null;
  }
};

export const createIndexIfNeeded = async (esClient: Client, indexName: string): Promise<boolean> => {
  const existsResp = await esClient.indices.exists({
    index: indexName,
  });
  const mustCreateIndex = !existsResp?.body;
  if (mustCreateIndex) {
    await esClient.indices.create({
      index: indexName,
    });
  }
  return mustCreateIndex;
};

export const countNOfDocs = async (esClient: Client, indexName: string): Promise<number> => {
  const respCounts = await esClient.count({
    index: indexName,
  });
  return respCounts?.body?.count;
};
