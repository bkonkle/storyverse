# Overview

Storyverse is a work-in-progress side-project that serves as a reference and testbed for Node.js application architecture. It implements a real-world project idea - a collaborative storytelling app - to demonstrate a cohesive end-to-end TypeScript/React/Node application structure that makes schema-first GraphQL development in a type-safe environment a breeze!

## Usable Architecture

For the past couple of years, I've been on a quest to find an end-to-end architecture that takes the hassle out of strict, type-safe GraphQL application development. My chosen stack at the time was built around [Postgraphile](https://www.graphile.org/postgraphile/), which is an outstanding tool if you are adept at SQL and you want your GraphQL schema to closely resemble your Postgres database schema. I got frequent feedback from clients and team members that they wanted to move further _away_ from SQL rather than embracing it, and they often wanted big changes between their database schema and their GraphQL schema.

I've tried a variety of different configurations, mostly based around Express because of its battle-tested stability and React because of my appreciation for its ecosystem. I spent a lot of time working with [Nest.js](https://nestjs.com/) and I like their dependency-injection system for the clarity it brings to mocked dependencies in testing. Ultimately, however, I settled on a slightly leaner approach that directly leverages [Apollo Server](https://www.apollographql.com/docs/apollo-server/), relies heavily on [GraphQL Code Generator](https://graphql-code-generator.com/), and uses [Next.js](https://nextjs.org/) on the front end.

## Schema-First
