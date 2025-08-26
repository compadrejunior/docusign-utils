import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import path from 'path';
dotenv.config();

// DocuSign JWT Auth Config
export const DOCUSIGN_CONFIG = {
  privateKeyPath: path.join(__dirname, '../private.key'), // Update with your private key path
  integratorKey: process.env.INTEGRATION_KEY, // DocuSign Integration Key (Client ID)
  userId: process.env.USER_ID, // DocuSign API User ID (GUID)
  authServer: 'account-d.docusign.com', // Demo: account-d.docusign.com, Production: account.docusign.com
  expiresIn: 3600, // 1 hour
  scopes: ['signature', 'impersonation'],
};

export function generateJWTToken() {
  const privateKey = fs.readFileSync(DOCUSIGN_CONFIG.privateKeyPath);
  const jwtPayload = {
    iss: DOCUSIGN_CONFIG.integratorKey,
    sub: DOCUSIGN_CONFIG.userId,
    aud: DOCUSIGN_CONFIG.authServer,
    scope: DOCUSIGN_CONFIG.scopes.join(' '),
  };
  return jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256', expiresIn: DOCUSIGN_CONFIG.expiresIn });
}

export async function getDocuSignAccessToken() {
  const jwtToken = generateJWTToken();
  const url = `https://${DOCUSIGN_CONFIG.authServer}/oauth/token`;
  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('assertion', jwtToken);
  try {
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}
