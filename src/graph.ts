// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as graph from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

function getAuthenticatedClient(accessToken: string) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

const getUserDetails = async function (accessToken: string) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client
    .api('/me')
    .select('id,displayName,mail,userPrincipalName')
    .get()

  let photo = null;

  await client
    .api('/me/photo/$value')
    .get()
    .then((res) => {
      console.log(res);
      photo = res;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log('\n\nphoto', photo, '\n\n')
  console.log('\n\nuser', user, '\n\n')

  user.photo = photo;
  return user;
}

export default { getUserDetails };