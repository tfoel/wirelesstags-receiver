FROM node:8-alpine

RUN     mkdir -p /opt/wirelesstags-receiver/
ADD     ./* /opt/wirelesstags-receiver/
RUN     cd /opt/wirelesstags-receiver && npm install && npm build

WORKDIR /opt/wirelesstags-receiver
CMD node build/server.js

EXPOSE 8080