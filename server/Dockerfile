# syntax=docker/dockerfile:1

FROM node:23.1-bookworm
LABEL org.opencontainers.image.source = "https://github.com/UTSCC09/project-simpleils"
RUN useradd --system --shell /sbin/nologin simpleils
COPY . /opt/simpleils
WORKDIR /opt/simpleils
RUN npm install --workspace server && npm run build --workspace server \
    && npm prune --omit=dev --workspace server
EXPOSE 3000

USER simpleils
CMD ["npm", "start", "--workspace", "server"]
