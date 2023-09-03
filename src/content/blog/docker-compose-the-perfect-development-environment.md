---
date: 2020-12-04T13:55:48.000Z
external: false
lastmod: '2020-12-19T16:58:10.602Z'
slug: docker-compose-the-perfect-development-environment
title: 'Docker Compose: The Perfect Development Environment'
---

# Local environments are complex

Working on a full-scale project and keeping our local development environment up-to-date is definitely not a simple task! Today, microservices are all around, we write less code, but the environment gets more complex. Every service needs to connect to at least one database (if not more). It might also need other services to work properly. One might say that the staging environment is the solution to all our problems, but I beg to differ. Because every developer might need a different version of a given service to complete their work, or need to populate different values in the database.

How can we keep track of these dependencies? How can we collaborate with our teammates on the correct settings? or share our work to set up the environment so others won't have to?

Docker Compose to the rescue! 🦸‍♂️

# What's Docker Compose anyway?

Before jumping to Compose, we have to understand the containers revolution. Container is a standardized artifact for software packaging. The same container can be used for development, testing, and production. It doesn't matter what language or framework you use, containers can package everything. It's a technology that has been around for a long-time but Docker made it super easy for developers to build and use them.

So Docker is a unified way to ship and run every service without having to install its runtime, OS dependencies, and libraries. And Compose is the glue that ties many containers together with a proper configuration, and infrastructure. It's a tool for defining and running multi-container Docker applications.

Compose comes down to a single YAML file that we can add to our repository so others or even our future-self will easily get a local environment up and running as simple as running `docker-compose up -d`.

# Installing Docker Compose

Mac users, if you have Docker Desktop For Mac installed, it comes bundled with Compose.
Otherwise, install Docker Compose by following the [official guide](https://docs.docker.com/compose/install/)

# Simple use-case

Let's get down to the nitty-gritty! As an example, we have a NodeJS service that needs a PostgreSQL instance to store data. That's it, only one dependency.

```yaml
version: "3.1"

volumes:
  db_vol:

services:
  db:
    image: postgres:11.6-alpine
    environment:
      - POSTGRES_DB=app
      - POSTGRES_PASSWORD=12345
    volumes:
      - db_vol:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```

This is how our Compose YAML file should look like. The convention is to save it in the root folder of our project under the name `docker-compose.yml`.

We first start by defining the schema version of this Docker Compose YAML schema. This way, Compose can keep backward compatibility with legacy schemas.

Going directly to the services node (we'll come back to volumes later), we first have to name our dependency. In our case, we'll name it `db`. It doesn't have any major impact, mostly for logging, networking, and reference purposes.

Now, we need to choose an image for our service. Luckily the Docker community is so awesome that you can find any image you need. We'll proceed with the [official Postgres image](https://hub.docker.com/_/postgres).

Followed by setting environment variables for configuring our database. For a full list of variables, see the link above. In the example, we set the database name and default user password. Feel free to change it to whatever you would like, maybe a more secured password.

Next, we would like to store the data of our database permanently. If not defined explicitly, the data will be cleaned whenever we shut the container down. The PostgreSQL data is stored in `/var/lib/postgresql/data` in the container file-system. Using the `volumes` property, we can bind this directory to a persistent volume that we defined before, `db_vol`. Going back to the volumes node that we skipped, we define an empty object `db_vol`. This tells Docker Compose that whatever we bind to `db_vol` should be persisted between runs. In our case, it's Postgres data folder.

Lastly, we need to expose ports so our NodeJS application can connect to the database. By default, Docker Compose creates a dedicated network adapter for service communication. Only ports that we ask to expose will be available to other networks. Here, we request to bind port 5432 (Postgres default port) in the dedicated network to port 5432 in localhost.

Once the file is ready and Docker Compose is installed, we can run `docker-compose up` in the root folder of our project. This will provision a Docker container for every service listed in the YAML file and create a dedicated network. We can add an argument to run it in the background `docker-compose up -d`. If we're done, simply running `docker-compose down` will shut down all the services.

Now we have a PostgreSQL instance available for our local development with all the relevant configurations inside.

# Advanced use-case

```yaml
version: "3.1"

volumes:
  db_vol:

services:
  db:
    image: postgres:11.6-alpine
    environment:
      - POSTGRES_DB=app
      - POSTGRES_PASSWORD=12345
    volumes:
      - db_vol:/var/lib/postgresql/data
    ports:
      - "5432:5432"
  api:
    image: gcr.io/daily-ops/daily-api
    depends_on:
      - db
    ports:
      - "3000:3000"
    environment:
      - DATABASE_HOST=db
      - PORT=3000
```

In real-life we might need more than just a database. For example, when building the front-end of our project, we need both a database and an API server. In this example, we instantiate two services. A database like before, and our API server that depends on the database. Like we did for the database, we name our service and define the image, ports, and environment variables. Not only that, but we want to let Compose know that our API depends on the db service. Compose can then prioritize the start-up order of every service. 

Remember the dedicated network that we talked about before? The cool thing is that every service can be referred with its name inside the network. See that we set the database host in the environment variables to be `db`, which is the exact name of our database service. We don't need to mess with IP or a complex discovery system. It's as simple as the service name.

That's it, now can run `docker-compose up` to make sure we have all the services for our front-end development. We don't have to know anything about how to set-up exactly Postgres or the API server. This can be a very complex process, and it's all encapsulated by Docker Compose.

And we're done! Now you can easily share your development environment with your teammates or open-source contributors with Docker Compose. 🤘

# Useful links

* [Installation guide](https://docs.docker.com/compose/install/)
* [Compose file reference](https://docs.docker.com/compose/compose-file/)
* [Docker Hub](https://hub.docker.com/)
