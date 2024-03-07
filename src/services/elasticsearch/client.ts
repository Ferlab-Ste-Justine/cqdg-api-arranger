import { Client } from '@elastic/elasticsearch';

import { esHost, esPass, esUser } from '../../config/env';

const esClient = new Client({
  node: esHost,
  auth: {
    password: esPass,
    username: esUser,
  },
});

export default esClient;
