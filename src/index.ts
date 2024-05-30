// import 'regenerator-runtime/runtime.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import downloadRouter from '@ferlab/next/lib/legacy/download';
import cors from 'cors';
import express from 'express';
import http from 'http';
import Keycloak from 'keycloak-connect';

import { getESIndexByIndex, getExtendedMappingByIndex } from '#src/utils';

import buildApp from './app';
import { ALLOW_CUSTOM_MAX_DOWNLOAD_ROWS, MAX_DOWNLOAD_ROWS, port, project } from './config/env';
import keycloakConfig from './config/keycloak';
import schema from './graphql/schema';
import esClient from './services/elasticsearch/client';

const startApp = async () => {
  try {
    const keycloak = new Keycloak({}, keycloakConfig);
    const app = buildApp(keycloak);
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      status400ForVariableCoercionErrors: true,
      formatError: (error) => {
        console.error('[ApolloServer] error', error);
        return error;
      },
    });
    const resolveContext = async (req) => ({
      auth: req.kauth?.grant?.access_token || {},
      schema,
      esClient,
      getExtendedMappingByIndex,
      getESIndexByIndex,
      MAX_DOWNLOAD_ROWS,
      ALLOW_CUSTOM_MAX_DOWNLOAD_ROWS,
    });
    await server.start();
    await app.use(
      `/${project}/graphql`,
      cors(),
      express.json({ limit: '50mb' }),
      expressMiddleware(server, { context: resolveContext })
    );
    await app.use(`/${project}/download` as any, downloadRouter(resolveContext));
    await httpServer.listen({ port });
    console.info(`[startApp] 🚀 Server ready on ${port}`);
  } catch (err) {
    console.error('[startApp] err', err);
  }
};

startApp();
