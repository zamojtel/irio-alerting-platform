# API

This is the API microservice that serves publicly available endpoints.

## Running

API requires a running database instance. One can start a local PostgreSQL instance using Docker:

```bash
docker compose up -d db
```

To run the API service locally, use the following command:

```bash
go run .
```