import { Command } from '@colyseus/command';

import { nanoid } from 'nanoid';

import { Poll } from '../schemas/Poll.js';
import { Choice } from '../schemas/Choice.js';

export class UpdateRoomPoll extends Command {
  execute({ poll }) {
    this.state.poll = new Poll().assign({
      title: poll.title,
      choices: poll.choices.map((choice) => {
        return new Choice().assign({ id: nanoid(), title: choice });
      }),
    });
  }
}
