import { createSet, deleteSet, getSets, SubActionTypes, updateSetContent, updateSetTag } from '@ferlab/next/lib/sets';
import { CreateSetBody, Set, SetSqon, UpdateSetContentBody, UpdateSetTagBody } from '@ferlab/next/lib/sets/types';
import resolveSetIdMiddleware from '@ferlab/next/lib/sqon/resolveSetIdMiddleware';
import compression from 'compression';
import cors from 'cors';
import express, { Express } from 'express';
import { Keycloak } from 'keycloak-connect';
import NodeCache from 'node-cache';

import packageJson from '../package.json' assert { type: 'json' };
import { cacheTTL, esHost, isDev, keycloakURL, maxSetContentSize, usersApiURL } from './config/env';
import genomicFeatureSuggestions, { SUGGESTIONS_TYPES } from './endpoints/genomicFeatureSuggestions';
import { getPhenotypesNodes } from './endpoints/phenotypes';
import { getStatistics } from './endpoints/statistics';
import schema from './graphql/schema';
import { STATISTICS_CACHE_ID, verifyCache } from './middleware/cache';
import { injectBodyHttpHeaders } from './middleware/injectBodyHttpHeaders';
import esClient from './services/elasticsearch/client';
import { globalErrorHandler, globalErrorLogger } from './utils/errors';

const { dependencies, version } = packageJson;

const buildApp = (keycloak: Keycloak): Express => {
  const app = express();

  const cache = new NodeCache({ stdTTL: cacheTTL });

  app.use(cors());
  app.use(compression());
  app.use(express.json({ limit: '50mb' }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: '50mb',
    })
  );
  app.use(injectBodyHttpHeaders());

  /** Update the validateGrant to Provides more logging/information
   * on the reason the token is rejected by keycloak **/
  // const k: any = keycloak;
  // const originalValidateGrant = k.grantManager.validateGrant;
  // k.grantManager.validateGrant = grant =>
  //   originalValidateGrant.call(k.grantManager, grant).catch(err => {
  //     console.error('Grant Validation Error', err);
  //     throw err;
  //   });

  app.use(
    keycloak.middleware({
      logout: '/logout',
      admin: '/',
    })
  );

  /** disable protect to enable graphql playground */
  if (!isDev) {
    app.use(keycloak.protect());
  }

  app.use(resolveSetIdMiddleware(usersApiURL));

  app.get('/status', (_req, res) =>
    res.send({
      dependencies,
      version,
      keycloak: keycloakURL,
      elasticsearch: esHost,
    })
  );

  app.post('/cache-clear', keycloak.protect('realm:ADMIN'), async (_req, res) => {
    cache.flushAll();
    res.send('OK');
  });

  app.get('/genesFeature/suggestions/:prefix', (req, res) =>
    genomicFeatureSuggestions(req, res, SUGGESTIONS_TYPES.GENE)
  );
  app.get('/variantsFeature/suggestions/:prefix', (req, res) =>
    genomicFeatureSuggestions(req, res, SUGGESTIONS_TYPES.VARIANT)
  );

  app.get('/statistics', verifyCache(STATISTICS_CACHE_ID, cache), async (req, res) => {
    const data = await getStatistics();
    cache.set(STATISTICS_CACHE_ID, data);
    res.json(data);
  });

  app.get('/sets', async (req, res) => {
    const accessToken = req.headers.authorization;
    const userSets = await getSets(accessToken, usersApiURL);

    res.send(userSets);
  });

  app.post('/sets', async (req, res) => {
    const accessToken = req.headers.authorization;
    const userId = req['kauth']?.grant?.access_token?.content?.sub;
    const createdSet = await createSet(
      req.body as CreateSetBody,
      accessToken,
      userId,
      usersApiURL,
      esClient,
      schema,
      maxSetContentSize
    );

    res.send(createdSet);
  });

  app.put('/sets/:setId', async (req, res) => {
    const requestBody: UpdateSetTagBody | UpdateSetContentBody = req.body as any;
    const accessToken = req.headers.authorization;
    const userId = req['kauth']?.grant?.access_token?.content?.sub;
    const { setId } = req.params;
    let updatedSet: Set;
    if (requestBody.subAction === SubActionTypes.RENAME_TAG) {
      updatedSet = await updateSetTag(requestBody as UpdateSetTagBody, accessToken, userId, setId, usersApiURL);
    } else {
      updatedSet = await updateSetContent(
        requestBody as UpdateSetContentBody,
        accessToken,
        userId,
        setId,
        esClient,
        schema,
        usersApiURL,
        maxSetContentSize
      );
    }
    res.send(updatedSet);
  });

  app.delete('/sets/:setId', async (req, res) => {
    const accessToken = req.headers.authorization;
    const { setId } = req.params;
    const deletedResult = await deleteSet(accessToken, setId, usersApiURL);
    res.send(deletedResult);
  });

  app.post('/phenotypes', async (req, res) => {
    const accessToken = req.headers.authorization;
    const sqon: SetSqon = req.body.sqon;
    const type: string = req.body.type;
    const aggregations_filter_themselves: boolean = req.body.aggregations_filter_themselves || false;
    const data = await getPhenotypesNodes(sqon, type, aggregations_filter_themselves, accessToken);

    res.send({ data });
  });

  app.use(globalErrorLogger, globalErrorHandler);

  return app;
};

export default buildApp;
