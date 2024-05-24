import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { fetchGenomicFeatureSuggestions } from '../services/elasticsearch';

export const SUGGESTIONS_TYPES = {
  VARIANT: 'variant',
  GENE: 'gene',
};

const getGenomicFeatureSuggestions = async (req: Request, res: Response, type: string): Promise<void> => {
  const suggestionResponse = await fetchGenomicFeatureSuggestions(req.params.prefix, type);
  const searchText = suggestionResponse?.text;
  const suggestions = suggestionResponse?.options?.map((suggestion) => suggestion._source);

  res.status(StatusCodes.OK).send({
    searchText,
    suggestions,
  });
};

export default getGenomicFeatureSuggestions;
