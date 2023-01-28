import { Schema, ArraySchema, defineTypes } from '@colyseus/schema';

import { Choice } from './Choice.js';

export class Configuration extends Schema {
  constructor() {
    super();

    this.poll = {
      title: '',
      choices: new ArraySchema(),
      options: {
        allowChangeCastedVote: false,
      },
    };
  }
}

defineTypes(Configuration, {
  poll: {
    title: 'string',
    choices: [Choice],
    options: {
      allowChangeCastedVote: 'boolean',
    },
  },
});
