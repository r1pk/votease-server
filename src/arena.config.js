import Arena from '@colyseus/arena';
import { monitor } from '@colyseus/monitor';
import expressBasicAuth from 'express-basic-auth';

import { VoteRoom } from './features/vote-room/index.js';

export default Arena.default({
  getId: () => 'VotEase Server',

  beforeListen: () => {},

  initializeGameServer: (gameServer) => {
    gameServer.define('vote-room', VoteRoom);
  },

  initializeExpress: (app) => {
    const auth = expressBasicAuth({
      users: {
        admin: process.env.COLYSEUS_MONITOR_PASSWORD,
      },
      challenge: true,
    });

    app.use('/monitor', auth, monitor());

    app.get('/', (req, res) => {
      res.send('VotEase Server');
    });
  },
});
