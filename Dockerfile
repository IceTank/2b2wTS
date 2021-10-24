FROM node:alpine

LABEL maintainer=rob9315
LABEL name=2b2wTS

WORKDIR /srv/app

COPY . /srv/app

RUN mkdir nmp-cache
RUN chmod +x entrypoint.sh

RUN apk add --no-cache git;\
npm install;\
apk del --no-cache git || true

EXPOSE 8090/tcp
EXPOSE 25565/tcp

CMD ./entrypoint.sh