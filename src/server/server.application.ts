import { environment } from '@environments/environment';
import * as express from 'express';
import { join } from 'path';
import { roomsRoutes } from './rooms';
import { usersRoutes } from './users';


// The Express app is exported so that it can be used by serverless Functions.
export function app() {
    const server = express();
    const distFolder = join(process.cwd(), 'dist/Eka/browser');

    server.set('view engine', 'html');
    server.set('views', distFolder);
    server.use(express.json());

    // Map api routes.
    server.use('/api/users', usersRoutes);
    server.use('/api/rooms', roomsRoutes);
    server.use('/api/**', (req, res) => {
      res.status(404).send('data requests are not yet supported');
    });

    // Serve static files from /browser
    server.get('*.*', express.static(distFolder, {
      maxAge: environment.cacheTime
    }));

    server.get('*', (req, res) => {
      res.status(200).sendFile(join(distFolder, 'index.html'));
    });

    return server;
  }
