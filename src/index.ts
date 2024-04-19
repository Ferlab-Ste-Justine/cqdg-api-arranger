import 'regenerator-runtime/runtime.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import express from 'express';
import http from 'http';
import Keycloak from 'keycloak-connect';

import buildApp from './app';
import { port, project } from './config/env';
import keycloakConfig from './config/keycloak';
import schema from './graphql/schema';

const startApp = async () => {
  try {
    const keycloak = new Keycloak({}, keycloakConfig);
    const app = buildApp(keycloak);
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      status400ForVariableCoercionErrors: true,
      formatError: error => {
        console.error('[ApolloServer] error', error);
        return error;
      },
    });
    const context = async req => ({
      auth: req.kauth?.grant?.access_token || {},
    });
    await server.start();
    await app.use(
      `/${project}/graphql`,
      cors(),
      express.json({ limit: '50mb' }),
      expressMiddleware(server, { context }),
    );
    await httpServer.listen({ port });
    console.info(`[startApp] 🚀 Server ready on ${port}`);
  } catch (err) {
    console.error('[startApp] err', err);
  }
};

startApp();
