import type { Handler, HandlerResponse } from '@netlify/functions';
import { createServer } from 'http';
import app from '../../src';

const handler: Handler = async (event, context) => {
  return new Promise<HandlerResponse>((resolve) => {
    const server = createServer(app);

    server.listen(0, () => {
      const { port } = server.address() as any;

      fetch(`http://localhost:${port}${event.rawUrl.replace(event.headers.host || '', '')}`, {
        method: event.httpMethod,
        headers: event.headers as Record<string, string>,
        body: event.body,
      })
        .then(async (resp) => {
          const body = await resp.text();

          const headers: Record<string, string> = {};
          resp.headers.forEach((value, key) => {
            headers[key] = value;
          });

          resolve({
            statusCode: resp.status,
            body,
            headers,
          });

          server.close(); // Clean up the server after response
        })
        .catch((err) => {
          console.error('Serverless Error:', err);
          resolve({
            statusCode: 500,
            body: 'Internal Server Error',
          });

          server.close(); // Clean up even on error
        });
    });
  });
};

export { handler };
