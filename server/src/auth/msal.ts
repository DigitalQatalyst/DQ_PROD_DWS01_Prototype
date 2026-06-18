import { ConfidentialClientApplication, CryptoProvider, LogLevel } from '@azure/msal-node';
import { config } from '../config.js';

let client: ConfidentialClientApplication | null = null;

export function getMsalClient(): ConfidentialClientApplication {
  if (!config.entra.clientId || !config.entra.clientSecret || !config.entra.tenantId) {
    throw new Error('Entra is not configured. Set ENTRA_TENANT_ID, ENTRA_CLIENT_ID, ENTRA_CLIENT_SECRET.');
  }
  if (!client) {
    client = new ConfidentialClientApplication({
      auth: {
        clientId: config.entra.clientId,
        authority: config.entra.authority,
        clientSecret: config.entra.clientSecret,
      },
      system: {
        loggerOptions: {
          logLevel: config.isProduction ? LogLevel.Warning : LogLevel.Error,
          piiLoggingEnabled: false,
          loggerCallback: (_level, message) => {
            if (!config.isProduction) console.log('[msal]', message);
          },
        },
      },
    });
  }
  return client;
}

export const cryptoProvider = new CryptoProvider();
