import { Schema, MapSchema, ArraySchema, defineTypes } from '@colyseus/schema';

import { User } from './User.js';
import { Poll } from './Poll.js';

export class RoomState extends Schema {
  constructor() {
    super();

    this.owner = new User();
    this.users = new MapSchema();
    this.poll = new Poll();
  }
}

defineTypes(RoomState, {
  owner: User,
  users: {
    map: User,
  },
  poll: Poll,
});
