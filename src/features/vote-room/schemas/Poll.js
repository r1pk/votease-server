import { Schema, ArraySchema, defineTypes } from '@colyseus/schema';

import { Choice } from './Choice.js';
import { Answer } from './Answer.js';

export class Poll extends Schema {
  constructor() {
    super();

    this.title = '';
    this.choices = new ArraySchema();
    this.answers = new ArraySchema();
  }
}

defineTypes(Poll, {
  title: 'string',
  choices: [Choice],
  answers: [Answer],
});
