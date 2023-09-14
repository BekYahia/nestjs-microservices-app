<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

# Nestjs Microservices APP
Nest.js microservices application (users, orders, payments, notifications) with <a href="https://docs.nestjs.com/microservices/rabbitmq" target="_blank">RabbitMQ</a> and <a href="https://www.apollographql.com/docs/federation/" target="_blank">Apollo Federation GraphQL API Gateway</a>

## Table of Contents

- [Installation](#installation)
- [Running the App](#running-the-app)
- [Overview](#overview)
  - [Users](#users)
  - [API Gateway](#api-gateway)
  - [Orders](#orders)
  - [Payments](#payments)
  - [Notifications](#notifications)
  - [Monitoring](#monitoring)
  - [Project Progress](#project-progress)

## Installation

I am using [pnpm](https://pnpm.io) for package management. If you don't have it installed, you can do so with npm:

```bash
npm install -g pnpm
```
Then, install the project's dependencies:

```bash
pnpm install
```

## Running the app
1) Rename `.env.sample` to `.env` in each microservice.
	- If you changed the port in one service, make sure to reflect these changes in other dependent services.
1) Start MongoDB and RabbitMQ in detached mode:
	```bash
	docker compose up -d mongo rabbitmq
	```

1) start the API Gateway which will run the depends services also.
	```bash
	docker compose up gateway
	```

## Overview
### Users
- The `Users` microservice has a hybrid connections
- Default URL: `localhost:3040`
- Create an account via `POST localhost:3040`
- Login via `POST: localhost:3040/login`
- Use the `access_token` from login as header in the Gateway
- Usages: CURD Actions
### API Gateway
- Access the `API Gateway` via `localhost:3050/graphql`
	- You must provide the auth header with the `access_token` you get from login
		- Header: `Authentication: Bearer ${access_token}`

### Orders
- Orders first send a request to payments, and after a valid payment, and new order will be created.

### Payments
- The application uses <a href="https://stripe.com" target="_blank">Stripe</a> as payments infrastructure 
- After the payment is completed, the `notifications` service is used to notify the user

### Notifications
The `Notifications` service handles email notifications.

## Monitoring

Using Grafana and Prometheus for monitoring the microservices.

### Accessing Metrics

1) Start Grafana with
	```bash
	docker compose up grafana
	```
1) Access the Grafana dashboard at `http://localhost:5050` enter admin for username and password.

- You can modify Prometheus settings such as scraping intervals and targets in the `prometheus.yml` configuration file.

- Grafana configuration, including setting up Prometheus as a datasource and default dashboards, can be found in the `/grafana` directory.


### Grafana Dashboard

Explore the dedicated Grafana dashboard to monitor the performance and health of the microservices.

## Project Progress

- [x] API Gateway (Completed)
- [x] Users Service (Completed)
- [ ] Orders Service (In Progress)
- [ ] Payments Service (In Progress)
- [ ] Notifications Service (In Progress)
