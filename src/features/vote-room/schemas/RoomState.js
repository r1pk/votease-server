import { Schema, MapSchema, defineTypes } from '@colyseus/schema';

import { User } from './User.js';
import { Configuration } from './Configuration.js';
import { Poll } from './Poll.js';

export class RoomState extends Schema {
  constructor() {
    super();

    this.owner = new User();
    this.config = new Configuration();
    this.poll = new Poll();
    this.users = new MapSchema();
  }
}

defineTypes(RoomState, {
  owner: User,
  config: Configuration,
  poll: Poll,
  users: {
    map: User,
  },
});
