import * as http from "http";
import * as serveStatic from "serve-static";
import * as finalHandler from "finalhandler";

const start = (dir: string): Promise<void> => {
  const serve = serveStatic(dir);
  const server = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      // FIXME
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      serve(req as any, res as any, finalHandler(req, res));
    }
  );
  const portString = process.env.PORT;
  const port =
    typeof portString === "undefined" ? 80 : parseInt(portString, 10);
  server.listen(port);
  return new Promise((resolve) => {
    server.on("close", () => resolve());
  });
};

export { start };
