import esClient from '../../services/elasticsearch/client';
import { EsMapping } from './types';

export const getBody = ({ field, value, path, nested = false }) => {
  if (nested) {
    return {
      query: {
        bool: {
          must: [
            {
              nested: {
                path,
                query: { bool: { must: [{ match: { [field]: value } }] } },
              },
            },
          ],
        },
      },
    };
  }
  return {
    query: {
      bool: {
        must: [
          {
            match: { [field]: value },
          },
        ],
      },
    },
  };
};

export const getEsMapping = async ({ esIndex }: { esIndex: string }): Promise<EsMapping> => {
  const response = await esClient.indices.getMapping({ index: esIndex });
  return response.body as EsMapping;
};
