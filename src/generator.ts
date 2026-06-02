import { copyFileSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

import { minify } from 'html-minifier-terser';
import { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import { compileAsync as compileSass } from 'sass';
import { transpileModule, TranspileOptions } from 'typescript';

import * as tsconfig from '../tsconfig.json';

import { Config, config } from './config';
import { About } from './pages/about';
import { NotFound } from './pages/errors';
import { Home } from './pages/home';
import { htmlDocument } from './pages/layout';
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
  readonly extension?: string;
  readonly filename?: string;
  readonly name: string;
  readonly path: string;
  readonly scripts?: string;
  readonly skipSitemap?: boolean;
  readonly styles?: string;
}

async function compileHTML(page: () => ReactElement, cfg: Config): Promise<string> {
  const content = page();

  return await minify(htmlDocument(cfg, renderToString(content)), {
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

  return transpileModule(source, tsconfig as unknown as TranspileOptions).outputText;
}

function discoverFilesToCopy(filepath: string): readonly FileCopyable[] {
  return readdirSync(path.join(__dirname, filepath)).map((filename: string) =>
    ({ destination: dist(filename), source: path.join(__dirname, filepath, filename) }));
}

function dist(...parts: readonly string[]): string {
  return path.join(__dirname, '..', 'dist', ...parts);
}


async function generator(): Promise<void> {
  const [homeStyles, errorStyles, aboutStyles, aboutScripts] = await Promise.all([
    compileSCSS('./scss/home.scss'),
    compileSCSS('./scss/error.scss'),
    compileSCSS('./scss/about.scss'),
    Promise.resolve(compileTypeScript('./js/about.ts')),
  ]);

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
    },
    {
      body: About,
      name: 'about',
      path: '/about',
      scripts: aboutScripts,
      styles: aboutStyles,
    },
  ];

  const [sitemap, compiledPages] = await Promise.all([
    generateSiteMap(config, pages.filter(page => !page.skipSitemap)),
    Promise.all(pages.map(async page => {
      const filename = page.filename || `${page.name}${page.extension || '.html'}`;
      const styles = page.styles || 'html{background-color:red}';
      const content = await compileHTML(page.body, { ...config, path: page.path, scripts: page.scripts, styles });

      return { content, filename };
    })),
  ]);

  const files: readonly FileWriteable[] = [
    ...compiledPages,
    { content: sitemap, filename: 'sitemap.xml' },
  ];
  console.info(`${files.length} files to write.`, '\n');

  files.forEach(file => {
    writeFileSync(dist(file.filename), file.content);
    console.info(`'${file.filename}' file generated.`);
  });

  const copyList = [
    { destination: dist('C4CE726F8465B7FC.txt'), source: path.join(__dirname, 'static', 'C4CE726F8465B7FC.txt') },
    { destination: dist('robots.txt'), source: path.join(__dirname, 'static', 'robots.txt') },

    ...discoverFilesToCopy('./img/favicon/'),
  ];

  console.info('\n', `${copyList.length} files to copy.`, '\n');

  copyList.forEach(file => {
    copyFileSync(file.source, file.destination);
    console.info(`'${file.source}' file copied.`);
  });
}

generator()
  .catch(console.error);
