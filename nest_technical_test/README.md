## Project setup

- Clone project

```bash
 $ git clone git@github.com:fihriaziz/BE-nestjs-test.git
```

- Run
```bash
$ yarn install
```

```bash 
$ cp .env.example .env
```

- Setup .env
```bash
  DB_HOST= 
  DB_PORT=
  DB_USERNAME=
  DB_PASSWORD=
  DB_NAME=
  PORT=
```

- Enable CORS
```bash
  CORS_ORIGIN=*
```

## Run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```