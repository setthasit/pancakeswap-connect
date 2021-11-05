# Pancakeswap Connect
## Description
This project will show how we can connect to PancakeSwap Masterchef and query the pools, user stake etc.

## Prerequisite
- Node.js v14.17.0
- Yarn v1.22.10
or
- Docker

## Techstack
- Typescript
- Nest.JS
- Web3.JS

## Installation
```bash
$  yarn
```

## Running the app with Node & Yarn
Before we start don't forget to modify the `.env` file. you can use .env.example as a template.
```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Running the app with Docker
Before we start don't forget to modify the `.env` file. you can use .env.example as a template.
```bash
# build docker image
$ docker build -t pcsw .

# run with docker image
$ docker run -p 8888:8888 pcsw
```

## How to use the app
Access you app by go to http://localhost:8888/


### Endpoint
- `/pancakeswap/pools` - List of the available pools
- `/pancakeswap/:user_address` - List of staking of the user
- `/pancakeswap/:user_address/pool/:pool_id` - Get user staking by pool ID