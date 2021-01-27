# Storyverse API

This is a [Nest.js](https://nestjs.com) application server written in TypeScript.

## Installation

### Dependencies

Install dependencies with [Yarn](http://yarnpkg.com):

```sh
yarn
```

Create a `.env` file:

```sh
cp .env.example .env
```

### Local Database

Use Docker to spin up a local database:

```sh
docker-compose up -d
```

Next, run the Schema migrations:

    yarn db.migrate

If you need to wipe your db and start over:

    yarn db.reset

## Running the Application

To run in development mode:

    yarn dev
