# Storyverse API

This is a Koa application server written in TypeScript. It uses GraphQL via [Postgraphile](https://www.graphile.org/postgraphile/) to communicate with the client.

## Installation

### Dependencies

Install dependencies with [Yarn](http://yarnpkg.com):

```sh
yarn
```

Create a `.env` file:

```ini
AUTH0_JWKS_URI=https://storyverse-dev.auth0.com/.well-known/jwks.json
AUTH0_AUDIENCE=localhost
AUTH0_ISSUER=https://storyverse-dev.auth0.com/
```

### Local Database

We use PostgreSQL v11. Install it locally via Homebrew on Mac, or your package manager on Linux.

Then set up a local superuser (if you haven't already):

    # If you're on Linux, run this command first.
    # If you're on Mac, skip it - Homebrew does this for you.
    sudo -u postgres createuser -s $USER

    createdb $USER -O $USER

Then set up a user for CF:

    createuser -s storyverse_root
    createdb storyverse -O storyverse_root

    psql -c "ALTER USER storyverse_root WITH PASSWORD 'password';"

Next, run the Schema migrations:

    yarn db.migrate

If you need to wipe your db and start over:

    yarn db.reset

## Running the Application

To run in development mode:

    yarn dev

### Building the Application outside of CI

To rebuild the Docker container for a new deploy:

```sh
# On Linux, make sure your user is part of the "docker" group so that you can
# run these commands without "sudo".

# Login to ECR:
yarn ecr.login
```

Then, run the Docker build:

```sh
yarn ecr.build
```

Next, the "ecr.upload" command will tag and push the image:

```sh
# Tag once with an incremental version number (update package.json)
TAG=0.0.0 AWS_ACCOUNT_ID=1234567890 yarn ecr.upload

# Run it again again with "latest"
AWS_ACCOUNT_ID=1234567890 yarn ecr.upload
```

### Managing the Remote DB

To manage the firewalled RDS database, you need to use the AWS host as a bastion server:

```sh
yarn db.tunnel.dev
```

```sh
yarn db.migrate.dev
```
