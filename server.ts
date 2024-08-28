import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import bootstrap from './src/main.server';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/api/**', (req, res) => {
    res.status(404).send('API routes not yet implemented');
  });

  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html',
  }));

    // Liste des routes spécifiques pour redirection
    const routes = [
      '/accueil',
      '/mentions-legales',
      '/conditions-generales-de-vente',
      '/politique-de-confidentialite',
      '/prestations',
      '/qui-suis-je',
      '/reflexologie'
    ];
  
    // Redirections spécifiques pour les pages importantes
    routes.forEach(route => {
      server.get(route, (req, res, next) => {
        commonEngine
          .render({
            bootstrap,
            documentFilePath: indexHtml,
            url: req.originalUrl,
            publicPath: browserDistFolder,
            providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
          })
          .then((html) => res.send(html))
          .catch((err) => next(err));
      });
    });

  server.get('**', (req, res, next) => {
    commonEngine.render({
      bootstrap,
      documentFilePath: indexHtml,
      url: req.originalUrl,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    })
    .then((html: string) => res.send(html))
    .catch((err: any) => next(err));
  });

  return server;
}

function run(): void {
  const port = parseInt(process.env['PORT'] || '4000', 10);  // Utilisation de ['PORT']
  
  if (isNaN(port)) {
    throw new Error('Invalid port number');
  }

  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();


