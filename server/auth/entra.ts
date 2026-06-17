import { AuthorizationCodeRequest, AuthorizationUrlRequest, ConfidentialClientApplication } from '@azure/msal-node';
import { config, isEntraConfigured } from '../config';

let client: ConfidentialClientApplication | null = null;

export function getEntraClient() {
  if (!isEntraConfigured()) {
    throw new Error('Entra ID is not configured.');
  }

  if (!client) {
    client = new ConfidentialClientApplication({
      auth: {
        clientId: config.entra.clientId,
        authority: `https://login.microsoftonline.com/${config.entra.tenantId}`,
        clientSecret: config.entra.clientSecret,
      },
    });
  }

  return client;
}

export async function getAuthorizationUrl(state: string) {
  const request: AuthorizationUrlRequest = {
    scopes: config.entra.scopes,
    redirectUri: config.entra.redirectUri,
    state,
    prompt: 'select_account',
  };

  return getEntraClient().getAuthCodeUrl(request);
}

export async function exchangeCodeForToken(code: string) {
  const request: AuthorizationCodeRequest = {
    code,
    scopes: config.entra.scopes,
    redirectUri: config.entra.redirectUri,
  };

  return getEntraClient().acquireTokenByCode(request);
}
