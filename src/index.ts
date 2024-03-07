import 'regenerator-runtime/runtime.js';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { getProject } from '@arranger/server';
import { Client } from '@elastic/elasticsearch';
import SQS from 'aws-sdk/clients/sqs';
import cors from 'cors';
import express from 'express';
import http from 'http';
import Keycloak from 'keycloak-connect';

import buildApp from './app';
import { port } from './config/env';
import keycloakConfig from './config/keycloak';
import schema from './graphql/schema';

const context = async req => ({
  auth: req.kauth?.grant?.access_token || {},
});

const keycloak = new Keycloak({}, keycloakConfig);
const sqs = new SQS({ apiVersion: '2012-11-05' });
const app = buildApp(keycloak, sqs, getProject);
const httpServer = http.createServer(app);
const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  status400ForVariableCoercionErrors: true,
  formatError: error => {
    console.log('[ApolloServer formatError]', error);
    return error;
  },
});

await server.start();

app.use('/graphql', cors(), express.json({ limit: '50mb' }), expressMiddleware(server, { context }));

await new Promise<void>(resolve => httpServer.listen({ port }, resolve));
console.log(`🚀 Server ready on ${port} ⚡️`);

// import Arranger from '@arranger/server';
// Arranger({
//   esHost,
//   esUser,
//   esPass,
//   graphqlOptions: {
//     context: externalContext,
//   },
// }).then(router => {
//   app.get('/*/ping', router);
//
//   /** disable protect to enable graphql playground */
//   isDev ? app.use(router) : app.use(keycloak.protect(), router);
//
//   app.listen(port, async () => {
//     console.log(`⚡️ Listening on port ${port} ⚡️`);
//   });
// });
