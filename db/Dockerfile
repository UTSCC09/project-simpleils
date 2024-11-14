# syntax=docker/dockerfile:1

FROM postgres:17.0-bookworm
COPY schema.sql /docker-entrypoint-initdb.d
EXPOSE 5432
