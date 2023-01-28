import { Command } from '@colyseus/command';

import { Answer } from '../schemas/Answer.js';

export class CreateUserAnswer extends Command {
  execute({ choiceId, userId }) {
    const answer = new Answer().assign({
      user: this.state.users.get(userId),
      choice: this.state.poll.choices.find((choice) => choice.id === choiceId),
    });

    this.state.poll.answers.push(answer);
  }
}
