import { existsSync, readFileSync } from 'fs';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import path from 'path';

const MIME: Readonly<Record<string, string>> = {
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
};

const dist = path.join(__dirname, '..', 'dist');
const port = Number(process.env['PORT'] ?? 8080);

function handle(req: IncomingMessage, res: ServerResponse): void {
  const raw = req.url ?? '/';
  const url = raw.endsWith('/') ? `${raw}index.html` : raw;
  const full = path.join(dist, url);

  if (!full.startsWith(`${dist}${path.sep}`)) {
    res.writeHead(403);
    res.end('Forbidden');

    return;
  }

  const withHtml = `${full}.html`;
  const file = existsSync(full) ? full
    : !path.extname(url) && existsSync(withHtml) ? withHtml
    : null;

  if (file !== null) {
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));

    return;
  }

  const notFound = path.join(dist, '404.html');
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(existsSync(notFound) ? readFileSync(notFound) : 'Not found');
}

createServer(handle).listen(port, () => {
  console.info(`Serving on http://localhost:${port}`);
});
