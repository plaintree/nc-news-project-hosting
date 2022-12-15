# Northcoders News API

## Background

You can checkout my API [here](https://nc-news-project-lo9x.onrender.com/api).

This API intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture. In this case, you can use this API to search for news with specific topics, its articles and comments. With future update, you can even look for specific users and the related comments

Database will be PostgreSQL, with the interaction of using [node-postgres](https://node-postgres.com/).

## You want to contribute or clone it?

It's easy. Below is the pre-requisite npm packages and enviromental variables for this API.

### Minimum development requirement

1. Node.js v18 or above
2. PostgreSQL v14 or above

### NPM packages necessary for development

1. dotenv
2. pg
3. express
4. jest (dev-dependencies)
5. jest-extended (dev-dependencies)
6. jest-sorted (dev-dependencies)
7. supertest (dev-dependencies)
8. pg-format (dev-dependencies)
9. husky (dev-dependencies)

### Environmental Variables

Please at the root directory of your local filesystem, create two new environment variable files `.env` for both development `.env.development` and test environments `.env.test`.

Enter `PGDATABASE=nc_news_test` in `.env.test` directory while `PGDATABASE=nc_news` in `.env.development` directory.

## Instruction on running test and seeding the local database

1. Make sure your local machine reach the minimum requirement.
2. Go to the terminal and input `$ npm install` to install the npm packages.
3. Start up PostgreSQL in your local machine.
4. Add the required `.env` files at the root directory.
5. Input `$ npm run setup-dbs`.
6. Input `$ npm run seed` to seed your database
7. Input `$ npm test` to check if the test suites running with passed test.
8. If error message is shown in the terminal, try to troubleshoot it and see if all the packages are installed correctly.

If you have any difficulties, please report to the developer (or simply Google it).
