import { Command } from '@colyseus/command';

export class ResetPollAnswers extends Command {
  execute() {
    this.state.poll.answers = [];
  }
}
