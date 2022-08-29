import { keycloakClient, keycloakRealm, keycloakURL } from './env';

const keycloakConfig = {
    realm: keycloakRealm,
    'confidential-port': 0,
    'bearer-only': true,
    'auth-server-url': keycloakURL,
    'ssl-required': 'external',
    resource: keycloakClient,
};

// cqdg-arranger:
// const keycloakConfig = {
//     clientId: authClientId,
//     bearerOnly: true,
//     serverUrl: authServerUrl,
//     realm: authRealm,
// };

export default keycloakConfig;
