import jwt from 'jsonwebtoken';

import { keycloakRealm, keycloakURL } from '../config/env';

const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
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
-----END RSA PRIVATE KEY-----
`;

// eslint-disable-next-line max-len
export const publicKey = `MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJgoVgqi7/C9uSoUsfQeep2Dbw5HfXWQIyypg+XZ3NqsxTA2k2Fr2vmBu82iGsNgwWBKac5IOzSGvyob1l64MkUCAwEAAQ==`;

export const getToken = (expire = 1000, sub = '12345-678-90abcdef', roles = []) =>
  jwt.sign(
    {
      iss: `${keycloakURL}/realms/${keycloakRealm}`,
      sub: sub,
      aud: 'cqdg-api-arranger',
      jti: '2c166d55-5ae6-4fb4-9daa-a1d5e1f535d7',
      user_id: sub,
      typ: 'Bearer',
      azp: 'portal-ui',
      session_state: 'ae2d1238-0180-4ea1-978a-8e9a95ba44f4',
      acr: '1',
      realm_access: {
        roles,
      },
      scope: 'email profile',
      email_verified: false,
      name: 'test test',
      groups: [],
      preferred_username: 'test@test.test',
      given_name: 'test',
      family_name: 'test',
      email: 'test@test.test',
    },
    privateKey,
    {
      expiresIn: expire,
      algorithm: 'RS256',
      keyid: 'Ip-PDWNUlHbpuTJ7mFERzFzm8CRDJU0A7qSRZMIFoQ0',
    }
  );
