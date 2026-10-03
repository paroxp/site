import { copyFileSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { minify } from 'html-minifier-terser';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { compileAsync as compileSass } from 'sass';
import { ModuleKind, ScriptTarget, transpileModule } from 'typescript';

import { config } from './config';
import { About } from './pages/about';
import { NotFound } from './pages/errors';
import { Home } from './pages/home';
import { DocumentProperties, htmlDocument } from './pages/layout';
import { generateSiteMap } from './pages/sitemap';

interface FileCopyable {
  readonly destination: string;
  readonly source: string;
}

interface FileWriteable {
  readonly content: string;
  readonly filename: string;
}

interface Page {
  readonly body: () => ReactElement;
  readonly filename?: string;
  readonly name: string;
  readonly path: string;
  readonly priority?: number;
  readonly scripts?: string;
  readonly skipSitemap?: boolean;
  readonly styles: string;
  readonly subtitle?: string;
}

async function compileHTML(body: () => ReactElement, page: DocumentProperties): Promise<string> {
  const content = body();

  return await minify(htmlDocument(page, renderToString(content)), {
    collapseWhitespace: true,
    minifyJS: true,
    removeComments: true,
  });
}

async function compileSCSS(filename: string): Promise<string> {
  const result = await compileSass(path.join(__dirname, filename), {
    loadPaths: ['src/scss'],
    style: 'compressed',
  });

  return result.css;
}

function compileTypeScript(filename: string): string {
  const source = readFileSync(path.join(__dirname, filename), 'utf8');

  return transpileModule(source, {
    compilerOptions: { module: ModuleKind.ESNext, target: ScriptTarget.ES2015 },
  }).outputText;
}

function discoverFilesToCopy(filepath: string): readonly FileCopyable[] {
  return readdirSync(path.join(__dirname, filepath)).map((filename: string) =>
    ({ destination: dist(filename), source: path.join(__dirname, filepath, filename) }));
}

function dist(...parts: readonly string[]): string {
  return path.join(__dirname, '..', 'dist', ...parts);
}


async function generator(): Promise<void> {
  const [homeStyles, errorStyles, aboutStyles] = await Promise.all([
    compileSCSS('./scss/home.scss'),
    compileSCSS('./scss/error.scss'),
    compileSCSS('./scss/about.scss'),
  ]);
  const aboutScripts = compileTypeScript('./js/about.ts');

  const pages: readonly Page[] = [
    {
      body: Home,
      filename: 'index.html',
      name: 'home',
      path: '/',
      styles: homeStyles,
    },
    {
      body: NotFound,
      name: '404',
      path: '/404',
      skipSitemap: true,
      styles: errorStyles,
      subtitle: 'Page not found',
    },
    {
      body: About,
      name: 'about',
      path: '/about',
      priority: 1.0,
      scripts: aboutScripts,
      styles: aboutStyles,
      subtitle: 'About',
    },
  ];

  const [sitemap, compiledPages] = await Promise.all([
    generateSiteMap(config, pages.filter(page => !page.skipSitemap)),
    Promise.all(pages.map(async page => {
      const filename = page.filename || `${page.name}.html`;
      const content = await compileHTML(page.body, {
        path: page.path,
        scripts: page.scripts,
        styles: page.styles,
        subtitle: page.subtitle,
      });

      return { content, filename };
    })),
  ]);

  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', config.url).href}\n`;

  const files: readonly FileWriteable[] = [
    ...compiledPages,
    { content: robots, filename: 'robots.txt' },
    { content: sitemap, filename: 'sitemap.xml' },
  ];
  console.info(`${files.length} files to write.`, '\n');

  files.forEach(file => {
    writeFileSync(dist(file.filename), file.content);
    console.info(`'${file.filename}' file generated.`);
  });

  const copyList = [
    ...discoverFilesToCopy('./static/'),
    ...discoverFilesToCopy('./img/favicon/'),
  ];

  console.info('\n', `${copyList.length} files to copy.`, '\n');

  copyList.forEach(file => {
    copyFileSync(file.source, file.destination);
    console.info(`'${file.source}' file copied.`);
  });
}

generator()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  });
