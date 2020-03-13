# NC News

This project was completed as part of the Northcoders Back-End Review. This API allows clients to access a "news" database. The data contained within the database includes articles, topics and comments. Using various endpoints, the client has access to the data and can add to, delete and manipulate the held data within the database.

## Getting Started

Clone this repository from github. In the command line, run:

`git clone https://github.com/philippaclaire9/backend-review.git`

## Prerequisites

A variety of software is needed to run this API. To install all necessary software, in the command line run:

`npm install`

## Testing

Several scripts are included in the package.json to facilitate testing. Running `npm test` will run the app.spec.js file.

The development environment is set to default.

## Example response

### GET request

`GET /api/topics`

#### Response

```
{topics : [
  { description: 'Code is love, code is life', slug: 'coding' },
  { description: 'FOOTIE!', slug: 'football' },
  { description: 'Hey good looking, what you got cooking?', slug: 'cooking' }]
  }
```

## Built with

Knex...
