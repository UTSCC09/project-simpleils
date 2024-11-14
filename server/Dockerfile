# syntax=docker/dockerfile:1

FROM node:23.1-bookworm
COPY . /simpleils
WORKDIR /simpleils
RUN npm install -ws && npm run build -ws
EXPOSE 3000
CMD ["npm", "start", "-w", "server"]
