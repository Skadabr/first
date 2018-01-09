FROM node:alpine

RUN apk add --no-cache tini

WORKDIR /app/client

COPY ./client/package.json .
RUN yarn -s
COPY ./client .
RUN yarn build

WORKDIR /app/server

COPY ./server/package.json .
RUN yarn -s
COPY ./server .


ENTRYPOINT ["/sbin/tini", "--"]
