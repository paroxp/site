import { Readable } from 'stream';

import { SitemapStream, streamToPromise } from 'sitemap';

import { Config } from '../../config';

interface Stack {
  readonly path: string;
  readonly priority?: number;
}

export async function generateSiteMap(config: Config, stack: readonly Stack[]): Promise<string> {
  const links = stack.map(link => ({
    changefreq: 'monthly',
    priority: link.priority ?? 0.3,
    url: link.path,
  }));

  const stream = new SitemapStream( { hostname: config.url } );
  const buff = await streamToPromise(Readable.from(links).pipe(stream));

  return buff.toString();
}
