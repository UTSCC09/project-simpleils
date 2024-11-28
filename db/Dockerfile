# syntax=docker/dockerfile:1

FROM postgres:17.0-bookworm
LABEL org.opencontainers.image.source = "https://github.com/UTSCC09/project-simpleils"
COPY schema.sql /docker-entrypoint-initdb.d
EXPOSE 5432
