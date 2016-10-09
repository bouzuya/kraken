import * as http from 'http';
import * as serveStatic from 'serve-static';
import * as finalHandler from 'finalhandler';

const start = (dir: string): Promise<void> => {
  // workaround for @types/finalhandler bug
  const final: typeof finalHandler.default = <any>finalHandler;
  const serve = serveStatic(dir);
  const server = http.createServer((req: any, res: any) => {
    serve(req, res, final(req, res));
  });
  const port = typeof process.env.PORT === 'undefined'
    ? 80 : parseInt(process.env.PORT, 10);
  server.listen(port);
  return new Promise((resolve) => {
    server.on('close', () => resolve());
  });
};

export { start };
