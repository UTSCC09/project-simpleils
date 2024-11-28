# syntax=docker/dockerfile:1

FROM node:23.1-bookworm as build
COPY . /root/simpleils
WORKDIR /root/simpleils
RUN npm install --workspace client && npm run build --workspace client

FROM nginx:1.27-bookworm
LABEL org.opencontainers.image.source = "https://github.com/UTSCC09/project-simpleils"
COPY --from=build /root/simpleils/client/dist /var/www/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
RUN ln -s /etc/letsencrypt/live/simpleils.tech /etc/nginx/certs
EXPOSE 80
