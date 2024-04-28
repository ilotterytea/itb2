ARG NODE_TAG=18

FROM node:$NODE_TAG AS builder
WORKDIR /tmp/ilotterytea/huinya/web
  COPY web .
  COPY .env .env

  RUN npm install
  RUN npm run build

  EXPOSE 3000