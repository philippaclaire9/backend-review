# NC News

This project was completed as part of the Northcoders Back-End Review. This API allows clients to access a "news" database. The data contained within the database includes articles, topics and comments. Using various endpoints, the client has access to the data and can add to, delete and manipulate the held data within the database. The API can be viewed here: http://nc-news-review.herokuapp.com

## Getting Started

Clone this repository from github. In the command line, run:

`git clone https://github.com/philippaclaire9/backend-review.git`

## Prerequisites

A variety of software is needed to run this API. To install all necessary software, in the command line run:

`npm install`

## Testing

Before running the tests, seed the database. Run `npm run setup-dbs` and then to seed the database in the test environment, run `npm run seed-test`. To seed it in the production environment, run `npm run seed-prod`.
Further scripts are included in the package.json to facilitate testing. Running `npm test` will run the app.spec.js file in the test environment.

The development environment is set to default.

## Create a knexfile.js

To configure the environments, create a knexfile.js as below.

### REMEMBER to gitignore the knexfile.js to keep your personal information safe.

```
const { DB_URL } = process.env;

const ENV = process.env.NODE_ENV || "development";

const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations"
  },
  seeds: {
    directory: "./db/seeds"
  }
};

const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      username: "<Your-PSQL-username-here>",
      password: "<Your-PSQL-password-here>"
    }
  },
  test: {
    connection: {
      database: "nc_news_test",
      username: "<Your-PSQL-username-here>",
      password: "<Your-PSQL-password-here>"
    }
  },
  production: {
    connection: `${DB_URL}?ssl=true`
  }
};

module.exports = { ...customConfig[ENV], ...baseConfig };

```

## Versions

This API was developed with the following versions of Node.js and Postgres but may work with older versions.

Node.js: v13.9.0

Postgres: 10.12

## Endpoints

To view a list of all available endpoints, go to http://nc-news-review.herokuapp.com/api
