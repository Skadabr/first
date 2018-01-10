# builder

FROM node:alpine as builder

RUN apk add --no-cache tini

WORKDIR /app/client

COPY ./client/package.json .
RUN yarn -s
COPY ./client .
RUN yarn build

# server

FROM node:alpine as server

RUN apk add --no-cache tini

WORKDIR /app/server

COPY ./server/package.json .
RUN yarn -s
COPY ./server .
COPY --from=builder /app/client/build /app/server/public

ENTRYPOINT ["/sbin/tini", "--"]
