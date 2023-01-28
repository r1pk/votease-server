import { Schema, defineTypes } from '@colyseus/schema';

export class Choice extends Schema {
  constructor() {
    super();

    this.id = '';
    this.title = '';
  }
}

defineTypes(Choice, {
  id: 'string',
  title: 'string',
});
