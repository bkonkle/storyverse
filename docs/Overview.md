# Overview

Storyverse is a work-in-progress side-project that serves as a reference and testbed for Node.js application architecture. It implements a real-world project idea - a collaborative storytelling app - to demonstrate a cohesive end-to-end TypeScript/React/Node application structure that makes schema-first GraphQL development in a type-safe environment a breeze!

## Usable Architecture

For the past couple of years, I've been on a quest to find an end-to-end architecture that takes the hassle out of strict, type-safe GraphQL application development. My chosen stack at the time was built around [Postgraphile](https://www.graphile.org/postgraphile/), which is an outstanding tool if you are adept at SQL and you want your GraphQL schema to closely resemble your Postgres database schema. I got frequent feedback from clients and team members that they wanted to move further _away_ from SQL rather than embracing it, and they often wanted big changes between their database schema and their GraphQL schema.

I've tried a variety of different configurations, mostly based around Express because of its battle-tested stability and React because of my appreciation for its ecosystem. I spent a lot of time working with [Nest.js](https://nestjs.com/) and I like their dependency-injection system for the clarity it brings to mocked dependencies in testing. Ultimately, however, I settled on a slightly leaner approach that directly leverages [Apollo Server](https://www.apollographql.com/docs/apollo-server/), relies heavily on [GraphQL Code Generator](https://graphql-code-generator.com/), and uses [Next.js](https://nextjs.org/) on the front end.

### Schema-First

I love the schema-first approach because it often leads to a system with built-in contracts between layers and loose coupling with dependencies. Replacements can often be swapped for different components within the solution, while the schema keeps the components unified. Consumers of the API can use the schema and generated types as a client contract with the API that is always kept up to date as the application changes. There are numerous opportunities to automatically generate additional resources and development tools based on the contract.

For example, if the inputs or outputs of a GraphQL operation change, the resulting TypeScript types that are generated based on the schema will also change, which throws type errors at the integration points that will need to be updated to account for the changes. It is necessary for front-end and back-end teams to communicate about the contract, because it's enforced directly in their code through type constraints. When that communication happens effectively, front end integrations can happen much more concurrently because backend services can define a contract long before the service is operational.

The downside is that it requires more tooling to sync the schema with generated resolvers or controllers and the types they use. In Node and TypeScript, however, there are rich tools for code generation based on a GraphQL schema (or to a lesser extent an OpenAPI schema). One of my goals with this project is to demonstrate a cohesive end-to-end solution taking advantage of the schema to keep each layer integrated by enforcing contracts with TypeScript.

This solution even takes advantage of the schema-first approach to define database structure, using Prisma's language for describing relational data. This allows Prisma to generate very specific TypeScript types for our database client, and makes it easier to draft new schema migrations.

### Strict Type Safety

### Effective Test Coverage

## API - Apollo Server with GraphQL Code Generator

### Prisma for Database Access

### Distributed GraphQL Schema

## Web - Next.js with Urql

### HttpOnly Cookie Authentication

### Urql with Generated Hooks

## (Coming Soon) Mobile - Expo.io with Urql

## Config - Terraform with AWS ECS

### Accounts, Environments, and Modules

### Alternative - Terraform with AWS Lambda
