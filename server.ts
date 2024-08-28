import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../');
  const indexHtml = join(serverDistFolder, '../index.html');

  const commonEngine = new CommonEngine();

  // Configuration des vues pour Express
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

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

  // Capturer toutes les autres routes pour un rendu SSR standard
  server.get('**', (req, res, next) => {
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

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Serveur Node Express en écoute sur http://localhost:${port}`);
  });
}

run();
