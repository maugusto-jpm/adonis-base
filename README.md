# Adonis Base

This is a base of an AdonisJs application API only, precofigured with:

- Authentication
- CORS
- Migrations
- Tests
- SQLite
- PostgreSQL
- ESLint and Prettier
- Debugging using [Visual Studio Code](https://code.visualstudio.com)

## Dependências

- [Yarn](https://yarnpkg.com/) - package manager;
- [Docker Compose](https://docs.docker.com/compose/) - containers manager (optional);

## Setup with Docker

Docker is not really necessary, but in this way, Postgres will be used as a Database and will prevent unexpected behavior

```bash
# Will build and start containers
docker-compose up -d

# Open container bash
docker-compose exec app sh

# Run commands bellow inside container
# Install dependencies
yarn install

# Create Postgres Database
yarn adonis database:pg:create

# To run server
yarn start

# To run tests
yarn test

# To run linter on all js files and auto fix files
yarn eslint_prettier
```

## Setup without Docker

The project can be run out of the container. In this way, SQLite will be used as a database for development and testing

```bash
# To install dependencies
yarn install

# To run server
yarn start

# To run tests
yarn test

# To run linter on all js files and auto fix files
yarn eslint_prettier
```

### Migrations

Run the following command to run migrations. Automatically runs before a test is run

```bash
yarn adonis migration:run
```

## Routes

`/`: (GET) Returns an JSON with `{ greeting: 'Hello world in JSON' }`

`/signin`: (POST) Creates a new User and return an JWT token. Request body should be in the format below:

```json
{
  "name": "User Name",
  "email": "user@email.com",
  "password": "user-password"
}
```

`/sessions`: (POST) Return an JWT token to user. Request body should be in the format below:

```json
{
  "email": "user@email.com",
  "password": "user-password"
}
```

`/forgot-password`: (POST) Creates a reset password token for the user and sends an email to the user. Request body should be in the format below:

```json
{
  "email": "user@email.com",
}
```

`/reset-password`: (POST) Resets user password based on token given. Request body should be in the format below:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
  "password": "new-password"
}
```

## Ports

- The Postgres server inside the application container, is available on the port `5432`;
- The Postgres server outside the application container, is available at the port `5454`;
- The application server, if run inside the container, is available on the port `5000`;
- The application server, if run outside the container, is available on the port `3000`;
- The application server during tests is available on the port `4000`;
