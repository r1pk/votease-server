import { Room } from '@colyseus/core';
import { Dispatcher } from '@colyseus/command';

import { RoomState } from '../schemas/RoomState.js';

import { ValidateCastedAnswers } from '../commands/ValidateCastedAnswers.js';
import { ValidateRoomPoll } from '../commands/ValidateRoomPoll.js';
import { ValidateUserAnswer } from '../commands/ValidateUserAnswer.js';
import { ValidateUsername } from '../commands/ValidateUsername.js';
import { ValidateUsernameUniqueness } from '../commands/ValidateUsernameUniqueness.js';
import { ValidateUserPermissions } from '../commands/ValidateUserPermissions.js';

import { CreateUserAnswer } from '../commands/CreateUserAnswer.js';
import { CreateUserInstance } from '../commands/CreateUserInstance.js';
import { DeleteUserAnswer } from '../commands/DeleteUserAnswer.js';
import { DeleteUserInstance } from '../commands/DeleteUserInstance.js';
import { ResetPollAnswers } from '../commands/ResetPollAnswers.js';
import { SetRoomOwner } from '../commands/SetRoomOwner.js';
import { UpdateRoomPoll } from '../commands/UpdateRoomPoll.js';

import { logger } from '##/logger.js';

export class VoteRoom extends Room {
  onCreate(options) {
    this.dispatcher = new Dispatcher(this);

    this.setPrivate(true);
    this.setState(new RoomState());

    this.dispatcher.dispatch(new ValidateRoomPoll(), {
      poll: options.poll,
    });
    this.dispatcher.dispatch(new UpdateRoomPoll(), {
      poll: options.poll,
    });

    this.onMessage('poll::edit', this.onEditPool.bind(this));
    this.onMessage('poll::reset-answers', this.onResetPollAnswers.bind(this));
    this.onMessage('poll::cast-answer', this.onCastAnswer.bind(this));
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
      this.dispatcher.dispatch(new SetRoomOwner(), {
        requirement: this.state.users.size === 1,
        userId: client.sessionId,
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
      this.dispatcher.dispatch(new SetRoomOwner(), {
        requirement: this.state.users.size > 0 && this.state.owner.id === client.sessionId,
        userId: this.state.users.keys().next().value,
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

  onEditPool(client, options) {
    try {
      this.dispatcher.dispatch(new ValidateUserPermissions(), {
        userId: client.sessionId,
      });
      this.dispatcher.dispatch(new ResetPollAnswers());
      this.dispatcher.dispatch(new ValidateRoomPoll(), {
        poll: options.poll,
      });
      this.dispatcher.dispatch(new UpdateRoomPoll(), {
        poll: options.poll,
      });

      logger.debug('Client edited poll!', { roomId: this.roomId, userId: client.sessionId });
    } catch (error) {
      this.onError(client, error);
    }
  }

  onResetPollAnswers(client) {
    try {
      this.dispatcher.dispatch(new ValidateUserPermissions(), {
        userId: client.sessionId,
      });
      this.dispatcher.dispatch(new ResetPollAnswers());

      logger.debug('Client reset poll answers!', { roomId: this.roomId, userId: client.sessionId });
    } catch (error) {
      this.onError(client, error);
    }
  }

  onCastAnswer(client, options) {
    try {
      this.dispatcher.dispatch(new ValidateUserAnswer(), {
        choiceId: options.choiceId,
      });
      this.dispatcher.dispatch(new ValidateCastedAnswers(), {
        userId: client.sessionId,
      });
      this.dispatcher.dispatch(new CreateUserAnswer(), {
        choiceId: options.choiceId,
        userId: client.sessionId,
      });

      logger.debug('Client casted answer!', { roomId: this.roomId, userId: client.sessionId });
    } catch (error) {
      this.onError(client, error);
    }
  }
}
