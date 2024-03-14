import { graphql } from 'graphql';
import { ExecutionResult } from 'graphql/execution/execute';

import { SetSqon, Sort } from '../endpoints/sets/setsTypes';
import esClient from '../services/elasticsearch/client';
import schema from './schema';

interface IrunQuery {
  query: string;
  variables: {
    sqon?: SetSqon;
    sort?: Sort[];
    first?: number;
  };
}

const runQuery = ({ query, variables }: IrunQuery): Promise<ExecutionResult> =>
  graphql({
    schema,
    contextValue: {
      esClient,
      schema,
    },
    source: query,
    variableValues: variables,
  });

export default runQuery;
