import { Schema, ArraySchema, defineTypes } from '@colyseus/schema';

import { Answer } from './Answer.js';

export class Poll extends Schema {
  constructor() {
    super();

    this.answers = new ArraySchema();
  }
}

defineTypes(Poll, {
  answers: [Answer],
});
