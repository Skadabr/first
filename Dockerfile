# builder

FROM node:alpine as builder

RUN apk add --no-cache tini

WORKDIR /app/client

COPY ./client/package.json .
RUN yarn -s
COPY ./client .
RUN yarn build

# core

FROM node:alpine as core

WORKDIR /app/core_build

COPY ./core/package.json .
RUN yarn -s
COPY ./core .
RUN yarn build


# server

FROM node:alpine as server

RUN apk add --no-cache tini

WORKDIR /app/server

COPY --from=core /app/core_build /app/core
COPY ./server/package.json .
RUN yarn -s
COPY ./server .
COPY --from=builder /app/client/build /app/server/public

ENTRYPOINT ["/sbin/tini", "--"]
