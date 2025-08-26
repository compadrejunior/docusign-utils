import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import * as jwt from 'jsonwebtoken';
import path from 'path';

dotenv.config();

if (!process.env.INTEGRATION_KEY || !process.env.USER_ID) {
  throw new Error('Missing required environment variables');
}

export function generateJWTToken() {
  const privateKey: string = fs.readFileSync(path.join(__dirname, '../private_pkcs8.key'), 'utf-8');
  const jwtPayload = {
    iss: process.env.INTEGRATION_KEY,
    sub: process.env.USER_ID,
    aud: 'account-d.docusign.com',
    scope: 'signature impersonation',
  };
  return jwt.sign(jwtPayload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
}

export async function getDocuSignAccessToken() {
  const jwtToken = generateJWTToken();

  const authServer = process.env.AUTH_SERVER;
  const url = `https://${authServer}/oauth/token`;
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
