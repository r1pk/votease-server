import { Room } from '@colyseus/core';
import { Dispatcher } from '@colyseus/command';

import { RoomState } from '../schemas/RoomState.js';

import { ValidateRoomPoll } from '../commands/ValidateRoomPoll.js';
import { ValidateUsername } from '../commands/ValidateUsername.js';
import { ValidateUsernameUniqueness } from '../commands/ValidateUsernameUniqueness.js';

import { UpdateRoomPoll } from '../commands/UpdateRoomPoll.js';
import { CreateUserInstance } from '../commands/CreateUserInstance.js';
import { DeleteUserInstance } from '../commands/DeleteUserInstance.js';
import { DeleteUserAnswer } from '../commands/DeleteUserAnswer.js';

import { logger } from '##/logger.js';

export class VoteRoom extends Room {
  onCreate(options) {
    this.dispatcher = new Dispatcher(this);

    this.setPrivate(true);
    this.setState(new RoomState());

    this.dispatcher.dispatch(new ValidateRoomPoll(), { poll: options.poll });
    this.dispatcher.dispatch(new UpdateRoomPoll(), { poll: options.poll });
  }

  onJoin(client, options) {
    try {
      this.dispatcher.dispatch(new ValidateUsername(), {
        username: options.username,
      });
      this.dispatcher.dispatch(new ValidateUsernameUniqueness(), {
        username: options.username,
      });
      this.dispatcher.dispatch(new CreateUserInstance(), {
        userId: client.sessionId,
        username: options.username,
      });

      logger.debug('Client joined!', { roomId: this.roomId, userId: client.sessionId, username: options.username });
    } catch (error) {
      this.onError(client, error);
    }
  }

  onLeave(client) {
    try {
      this.dispatcher.dispatch(new DeleteUserInstance(), {
        userId: client.sessionId,
      });
      this.dispatcher.dispatch(new DeleteUserAnswer(), {
        userId: client.sessionId,
      });

      logger.debug('Client left!', { roomId: this.roomId, userId: client.sessionId });
    } catch (error) {
      this.onError(client, error);
    }
  }

  onDispose() {
    logger.debug('Room disposed!', { roomId: this.roomId });
  }

  onError(client, error) {
    client.error(0, error.message);

    logger.error('Something went wrong!', { roomId: this.roomId, userId: client.sessionId, message: error.message });
  }
}
