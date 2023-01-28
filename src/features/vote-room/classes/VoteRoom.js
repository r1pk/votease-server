import { Room } from '@colyseus/core';

import { logger } from '../../../logger.js';

export class VoteRoom extends Room {
  onCreate(options) {}

  onJoin(client, options) {
    console.log(client.sessionId, 'joined!');
  }

  onLeave(client, consented) {
    console.log(client.sessionId, 'left!');
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
