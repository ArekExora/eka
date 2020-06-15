import { environment } from '@environments/environment';
import { SocketController } from './socket/socket.controller';

import { app } from './server.application';
import * as io from 'socket.io';
import * as http from 'http';

function run() {
  const port = environment.port || 3000;

  // Start up the Node server
  const server = http.createServer(app());
  // tslint:disable-next-line: no-unused-expression
  new SocketController(io(server, { serveClient: false }));

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}
