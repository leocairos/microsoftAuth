import { Router, Request, Response } from 'express';

import * as msal from '@azure/msal-node';
import graph from './graph';

const {
  MICROSOFT_OAUTH_APP_ID,
  MICROSOFT_OAUTH_APP_SECRET,
  MICROSOFT_OAUTH_REDIRECT_URI,
  MICROSOFT_OAUTH_SCOPES,
  MICROSOFT_OAUTH_AUTHORITY } = process.env;

const router = Router();

// MSAL config
const msalConfig = {
  auth: {
    clientId: MICROSOFT_OAUTH_APP_ID as string,
    authority: MICROSOFT_OAUTH_AUTHORITY as string,
    clientSecret: MICROSOFT_OAUTH_APP_SECRET as string
  },
  system: {
    loggerOptions: {
      loggerCallback(loglevel = 2, message: string, containsPii = false) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose || 2,
    }
  }
};

// Create msal application object
const msalClient = new msal.ConfidentialClientApplication(msalConfig);

router.get('/', function (req: Request, res: Response, next: any) {
  //console.log('user', req)
  res.render('index', { user: {}, url: '/signin' });
});

router.get('/signin',
  async function (req, res) {
    const urlParameters = {
      scopes: (MICROSOFT_OAUTH_SCOPES as string).split(','),
      redirectUri: MICROSOFT_OAUTH_REDIRECT_URI as string
    };

    try {
      const authUrl = await msalClient.getAuthCodeUrl(urlParameters);
      res.redirect(authUrl);
    }
    catch (error) {
      console.log(`Error: ${error}`);
      res.redirect('/');
    }
  }
);

// <CallbackSnippet>
router.get('/auth/callback',
  async function (req, res) {
    const tokenRequest = {
      code: req.query.code as string,
      scopes: (MICROSOFT_OAUTH_SCOPES as string).split(','),
      redirectUri: MICROSOFT_OAUTH_REDIRECT_URI as string
    };

    try {
      const response = await msalClient.acquireTokenByCode(tokenRequest);

      console.log('accessToken', response?.accessToken)

      const user = await graph.getUserDetails(response!.accessToken);

      //console.log('user', user);
    } catch (error) {
      console.log('ERROR', error);
    }

    res.redirect('/');
  }
);


router.get('/signout',
  async function (req, res) {
    //to Do
    res.redirect('/');
  }
);

export default router;