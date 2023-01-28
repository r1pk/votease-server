import { Command } from '@colyseus/command';

export class SetRoomOwner extends Command {
  execute({ requirement = true, userId }) {
    if (requirement) {
      this.state.owner = this.state.users.get(userId);
    }
  }
}
