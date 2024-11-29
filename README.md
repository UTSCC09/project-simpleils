[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/DnqlZtdt)

# SimpleILS
SimpleILS is a web-based integrated library system designed to help libraries manage common activities such as cataloguing and borrowing.

## Demo
A demo of the app is available at https://simpleils.tech.

## Installation
1. Modify `app-config.json` and `nginx/nginx.conf` to customize the app name and URL.
You will also need to modify `compose.yaml` and `nginx/Dockerfile` so that your TLS certificate is mounted at `/etc/nginx/certs` in the `nginx` container.
2. Rename `sample.env` to `.env` and supply any missing values.
3. Run `docker compose build` to build the container images.

To run the application, run `docker compose up`.
By default, an administrator account is created with email `admin@simpleils.tech` and password `adminpassword`.
You will want to change these values if you host the application yourself.
