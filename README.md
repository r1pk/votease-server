# VotEase-server

VotEase-server is a server written in [Node.js](https://nodejs.org/en/) using [Colyseus.js](https://www.colyseus.io/) framework for VotEase application.  
Server is responsible for handling all communication between clients in specific rooms and managing room state.

## Pre-requisites

- [node.js v18.0 or higher](https://nodejs.org/en/)
- [npm v8.0 or higher](https://nodejs.org/en/download/)

## Installation

Clone VotEase-server repository

```bash
git clone https://github.com/r1pk/votease-server.git master
```

Install all dependencies

```bash
cd ./master
npm install
```

Fill in all required environment variables in `.env` files

```env
NODE_ENV=production         # type of environment
COLYSEUS_MONITOR_PASSWORD=  # password for colyseus monitor
```

Run server

```bash
npm start
```

## Project structure

```
src
  |-- features            # available room types
  |  |-- room-type        # room directory
  |  |  |-- classes       # classes related to room (mostly room classes)
  |  |  |-- commands      # commands used by given room
  |  |  |-- schemas       # schemas used by given room
  |  |  |-- index.js      # exports main room class
  |-- arena.config.js     # contains and exports created arena config
  |-- logger.js           # logger configuration
  |-- index.js            # server entry point
```

Files outside of `src` directory are mostly configuration files for git, editor and npm.

## Room types

### Vote-Room

#### Room state schema

- [Schema definition](./src/features/vote-room/schemas/RoomState.js)

#### Events listened by server

- `poll::edit` - edit current poll in room.
  Accept object with `title` and `choices` fields. `title` is a string with poll title and `choices` is an array of strings with poll choices.

  ```json
  {
    "title": "string",
    "choices": ["string"]
  }
  ```

- `poll::reset-answers` - reset all answers in poll.
  Accepts empty object. This event is only available for current room owner otherwise it will throw an error.

  ```
  {}
  ```

- `poll::cast-answer` - cast answer to poll.
  Accepts object with `choiceId` field which is a string with id of selected choice.

  ```
  {
    choiceId: string
  }
  ```

#### Client communication

Communication between client and server is done using [Colyseus.js](https://www.colyseus.io/) framework which notifies every client about changes in room state.

## Author

- Patryk [r1pk](https://github.com/r1pk) Krawczyk

## License

- [MIT](https://choosealicense.com/licenses/mit/)
