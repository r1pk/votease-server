import { Schema, defineTypes } from '@colyseus/schema';

import { Choice } from './Choice.js';
import { User } from './User.js';

export class Answer extends Schema {
  constructor() {
    super();

    this.user = new User();
    this.choice = new Choice();
  }
}

defineTypes(Answer, {
  user: User,
  choice: Choice,
});
