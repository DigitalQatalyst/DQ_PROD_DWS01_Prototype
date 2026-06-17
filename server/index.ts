import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { apiRouter } from './api/routes';
import { authRouter } from './auth/routes';
import { config, requireProductionSecrets } from './config';

requireProductionSecrets();

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());

app.get('/healthz', (_request, response) => {
  response.json({ ok: true, service: 'dws01-bff' });
});

app.get(['/login', '/home'], (request, response) => {
  response.redirect(new URL(request.originalUrl, config.frontendOrigin).toString());
});

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : 'Unexpected server error';
  console.error('[bff-error]', error);
  response.status(500).json({ error: message });
});

app.listen(config.port, () => {
  console.info(`DWS.01 BFF listening on http://localhost:${config.port}`);
});
