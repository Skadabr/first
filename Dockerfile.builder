FROM node:alpine

WORKDIR /app/client

RUN apk add --no-cache tini

COPY ./client/package.json .
RUN yarn -s
COPY ./client .
RUN yarn build

ENTRYPOINT ["/sbin/tini", "--"]
