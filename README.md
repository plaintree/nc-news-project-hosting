# Northcoders News API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## npm packages necessary for development

1. dotenv
2. pg
3. express
4. jest (dev-dependencies)
5. jest-extended (dev-dependencies)
6. supertest (dev-dependencies)
7. pg-format (dev-dependencies)
8. husky (dev-dependencies)

## Environmental Variables

Please at the root directory of your local filesystem, create two new environment variable files `.env` for both development `.env.development` and test environments `.env.test`.

Enter `PGDATABASE=nc_news_test` in `.env.test` directory while `PGDATABASE=nc_news` in `.env.development` directory.
