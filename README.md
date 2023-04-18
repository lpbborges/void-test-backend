# void-backend-test

## Installation

First of all, you need to have a pg database running, you can start it with docker if you don't have one

```bash
docker compose up -d
```

Copy the .env.example file as .env and fill the vars with your data

```bash
cp .env.example .env
```

```bash
npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
