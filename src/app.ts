import SQS from 'aws-sdk/clients/sqs';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import { Keycloak } from 'keycloak-connect';
import { createRequire } from 'module';
import NodeCache from 'node-cache';

import { cacheTTL, esHost, keycloakURL } from './config/env';
import genomicFeatureSuggestions, { SUGGESTIONS_TYPES } from './endpoints/genomicFeatureSuggestions';
import { getPhenotypesNodes } from './endpoints/phenotypes';
import { searchAllSources } from './endpoints/searchByIds/searchAllSources';
import { SearchByIdsResult } from './endpoints/searchByIds/searchByIdsTypes';
import {
  createSet,
  deleteSet,
  getSets,
  SubActionTypes,
  updateSetContent,
  updateSetTag,
} from './endpoints/sets/setsFeature';
import { CreateSetBody, Set, SetSqon, UpdateSetContentBody, UpdateSetTagBody } from './endpoints/sets/setsTypes';
import { getStatistics } from './endpoints/statistics';
import { STATISTICS_CACHE_ID, verifyCache } from './middleware/cache';
import { injectBodyHttpHeaders } from './middleware/injectBodyHttpHeaders';
import { resolveSetIdMiddleware } from './middleware/resolveSetIdInSqon';
import { ArrangerProject } from './sqon/searchSqon';
import { globalErrorHandler, globalErrorLogger } from './utils/errors';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dependencies, version } = require('../package.json');

const buildApp = (keycloak: Keycloak, sqs: SQS, getProject: (projectId: string) => ArrangerProject): Express => {
  const app = express();

  const cache = new NodeCache({ stdTTL: cacheTTL });

  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '50mb' }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: '50mb',
    }),
  );
  app.use(injectBodyHttpHeaders());

  app.use(
    keycloak.middleware({
      logout: '/logout',
      admin: '/',
    }),
  );

  app.use(resolveSetIdMiddleware());

  app.get('/status', (_req, res) =>
    res.send({
      dependencies,
      version,
      keycloak: keycloakURL,
      elasticsearch: esHost,
    }),
  );

  app.post('/cache-clear', keycloak.protect('realm:ADMIN'), async (_req, res) => {
    cache.flushAll();
    res.send('OK');
  });

  app.get('/genesFeature/suggestions/:prefix', (req, res) =>
    genomicFeatureSuggestions(req, res, SUGGESTIONS_TYPES.GENE),
  );
  app.get('/variantsFeature/suggestions/:prefix', (req, res) =>
    genomicFeatureSuggestions(req, res, SUGGESTIONS_TYPES.VARIANT),
  );

  app.get('/statistics', verifyCache(STATISTICS_CACHE_ID, cache), async (req, res) => {
    const data = await getStatistics();
    cache.set(STATISTICS_CACHE_ID, data);
    res.json(data);
  });

  app.post('/searchByIds', async (req, res) => {
    const ids: string[] = req.body.ids;
    const projectId: string = req.body.project;
    const participants: SearchByIdsResult[] = await searchAllSources(ids, projectId, getProject);

    res.send({ participants });
  });

  app.get('/sets', async (req, res) => {
    const accessToken = req.headers.authorization;
    const userSets = await getSets(accessToken);

    res.send(userSets);
  });

  app.post('/sets', async (req, res) => {
    const accessToken = req.headers.authorization;
    const userId = req['kauth']?.grant?.access_token?.content?.sub;
    const createdSet = await createSet(req.body as CreateSetBody, accessToken, userId, sqs, getProject);

    res.send(createdSet);
  });

  app.put('/sets/:setId', async (req, res) => {
    const requestBody: UpdateSetTagBody | UpdateSetContentBody = req.body;
    const accessToken = req.headers.authorization;
    const userId = req['kauth']?.grant?.access_token?.content?.sub;
    const setId: string = req.params.setId;
    let updatedSet: Set;

    if (requestBody.subAction === SubActionTypes.RENAME_TAG) {
      updatedSet = await updateSetTag(requestBody as UpdateSetTagBody, accessToken, userId, setId, sqs);
    } else {
      updatedSet = await updateSetContent(
        requestBody as UpdateSetContentBody,
        accessToken,
        userId,
        setId,
        sqs,
        getProject,
      );
    }
    res.send(updatedSet);
  });

  app.delete('/sets/:setId', async (req, res) => {
    const accessToken = req.headers.authorization;
    const userId = req['kauth']?.grant?.access_token?.content?.sub;
    const setId: string = req.params.setId;

    const deletedResult = await deleteSet(accessToken, setId, userId, sqs);

    res.send(deletedResult);
  });

  app.post('/phenotypes', async (req, res) => {
    const accessToken = req.headers.authorization;
    const sqon: SetSqon = req.body.sqon;
    const type: string = req.body.type;
    const projectId: string = req.body.project;
    const aggregations_filter_themselves: boolean = req.body.aggregations_filter_themselves || false;
    const data = await getPhenotypesNodes(
      sqon,
      projectId,
      getProject,
      type,
      aggregations_filter_themselves,
      accessToken,
    );

    res.send({ data });
  });

  app.use(globalErrorLogger, globalErrorHandler);

  return app;
};

export default buildApp;
