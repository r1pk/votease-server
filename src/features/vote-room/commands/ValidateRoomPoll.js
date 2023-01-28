import { Command } from '@colyseus/command';

import Joi from 'joi';

export class ValidateRoomPoll extends Command {
  execute({ poll }) {
    Joi.attempt(
      poll,
      Joi.object({
        title: Joi.string().required(),
        choices: Joi.array().items(Joi.string()).required(),
      }).label('poll')
    );
  }
}
