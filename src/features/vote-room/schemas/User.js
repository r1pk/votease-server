import { Schema, defineTypes } from '@colyseus/schema';

export class User extends Schema {
  constructor() {
    super();

    this.id = '';
    this.username = '';
  }
}

defineTypes(User, {
  id: 'string',
  username: 'string',
});
