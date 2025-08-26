import express, { Request, Response, Router } from 'express';
import axios from 'axios';
import { getDocuSignAccessToken } from './docusign-jwt';

const app = express();
const route = Router();

app.use(express.json());

route.get('/', (req: Request, res: Response) => {
  res.json({ message: 'hello world with Typescript' });
});

// DocuSign JWT Token endpoint
route.get('/jwt-token', async (req: Request, res: Response) => {
  try {
    const tokenData = await getDocuSignAccessToken();
    res.json(tokenData);
  } catch (error: any) {
    res.status(500).json({ error });
  }
});

route.get('/ds/callback', (req: Request, res: Response) => {
  const code = req.query.code;
  res.json({ message: 'DS Callback', code });
});

route.get('/ds/code', async (req: Request, res: Response) => {
  const response = await axios.get('https://account-d.docusign.com/oauth/auth', {
    params: {
      response_type: 'code',
      scope: 'signature impersonation',
      client_id: '9774f032-f3de-4b38-9c98-7761e0435895',
      redirect_uri: 'http://localhost:8080/ds/callback',
    },
  });

  // Final URL after redirects
  const responseURL = response.request.res.responseUrl;
  console.log('Response URL:', responseURL);

  // res.json({ message: 'Response code', responseURL, data: response.data });
  res.redirect(responseURL);
});

route;

app.use(route);
app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
