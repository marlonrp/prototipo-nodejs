# About the application

This is a simple API using [Nodemon](https://www.npmjs.com/package/nodemon), there is an entity (Product) and it has [Redis](https://redis.io/) cache implemented in GET method.

# How to start the application

## Requirements

Must have [Docker](https://www.docker.com/) installed.

Need to install [NodeJS](https://nodejs.org/en/download/).

## Command Prompt/IDE

Run the command `docker-compose up -d` in the main root.

Than just run `npm run dev` to start.

## Testing API

    URL: http://localhost:3000/products
    Method allowed: GET
    Response:
    {
        "docs": [
            {
                "_id": "615243a1cdffe898e97dc728",
                "title": "Produto 1",
                "description": "P1",
                "createAt": "2021-09-27T22:20:17.610Z",
                "__v": 0
            }
        ],
        "total": 2,
        "limit": 10,
        "page": 1,
        "pages": 1
    }

    URL: http://localhost:3000/products/{id}
    Method allowed: GET
    Response:
    {
        "_id": "615243a1cdffe898e97dc728",
        "title": "Produto 1",
        "description": "P1",
        "createAt": "2021-09-27T22:20:17.610Z",
        "__v": 0
    }

    URL: http://localhost:3000/products
    Method allowed: POST
    Body:
    {
        "title": "Produto 1",
        "description": "P1"
    }
    Response:
    {
        "_id": "615243a1cdffe898e97dc728",
        "title": "Produto 1",
        "description": "P1",
        "createAt": "2021-09-27T22:20:17.610Z",
        "__v": 0
    }

    URL: http://localhost:3000/products/{id}
    Method allowed: PUT
    Body:
    {
        "title": "Produto 1",
        "description": "P1"
    }
    Response:
    {
        "_id": "615243a1cdffe898e97dc728",
        "title": "Produto 1",
        "description": "P1",
        "createAt": "2021-09-27T22:20:17.610Z",
        "__v": 0
    }

    URL: http://localhost:3000/products/{id}
    Method allowed: DELETE
    Response:
    {
        "_id": "615243a1cdffe898e97dc728",
        "title": "Produto 1",
        "description": "P1",
        "createAt": "2021-09-27T22:20:17.610Z",
        "__v": 0
    }
