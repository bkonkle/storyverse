# Storyverse

A collaborative storytelling app. Create a story universe, invite friends to contribute stories to series in your universe, and follow your favorites!

## Project Layout

This project is packaged with [nx](https://nx.dev/). The following apps are available:

- [Api](apps/api) - A schema-first [Apollo GraphQL](https://www.apollographql.com/) server using [Prisma](https://www.prisma.io/) to connect to a [Postgres](https://www.postgresql.org/) data store.
- [Web](apps/web) - A [Next.js](https://nextjs.org/) front end app using [next-auth](https://next-auth.js.org/), [Urql](https://formidable.com/open-source/urql/), and [GraphQL Codegen](https://graphql-code-generator.com/).

A libs folder is also available for reusable modules available to use across multiple apps:

- [assets](libs/assets) - Shared static assets for the front end.
- [components](libs/components) - Shared React components for the front end.

These are just stubs, and don't hold much yet.

## Screencasts

This application is being developed as a demo project for a screencast series. Stay tuned for more info!

## Tools

The following tools are used to build the server and client applications:

- [nx](https://nx.dev) - Extensible dev tools for monorepos.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript for powerful static analysis.
- [Node](https://nodejs.org/) - A JavaScript runtime built on Chrome's V8 engine.
- [Express](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - A GraphQL server with great tools for using the schema to resolve gql requests with Node promises.
- [Prisma](https://www.prisma.io/) - A schema-first ORM for TypeScript with an auto-generated type-safe client library.
- [GraphQL Code Generator](https://graphql-code-generator.com/) - Generate code and types directly from your GraphQL schema.
- [React](https://reactjs.org/) - A JavaScript library for declarative and performant user interfaces.
- [Next.js](https://nextjs.org/) - A full-featured front end React application framework.
- [next-auth](https://next-auth.js.org/) - A flexible authentication stack for Next.js.
- [Urql](https://formidable.com/open-source/urql/) - A blazing-fast GraphQL client using React components and hooks.

## Thanks

Many nx build tools were borrowed from:

- [https://github.com/erkobridee/nx-nextjs](https://github.com/erkobridee/nx-nextjs)

Thanks, Erko Bridee!
