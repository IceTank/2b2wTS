FROM node:16-alpine as builder

WORKDIR /srv/app

COPY ./src /srv/app/src
COPY ./svelte ./svelte
COPY ./*.json .
COPY ./assets ./assets
COPY ./*.js .

RUN apk add --no-cache git python3 make;\
npm install;\
apk del --no-cache git || true

FROM node:16-alpine

LABEL maintainer=rob9315
LABEL name=2b2wTS

WORKDIR /srv/app
COPY --from=builder /srv/app/node_modules ./node_modules/
COPY --from=builder /srv/app/lib ./lib
COPY --from=builder /srv/app/frontend ./frontend
# COPY --from=builder /srv/app/config ./config
COPY --from=builder /srv/app/package.json .

RUN mkdir nmp-cache

EXPOSE 8090/tcp
EXPOSE 25565/tcp

ENTRYPOINT [ "npm", "start" ] 