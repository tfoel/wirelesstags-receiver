FROM node:8-alpine

RUN     mkdir -p /opt/wirelesstags-receiver/
ADD     * /opt/wirelesstags-receiver/
ADD     src /opt/wirelesstags-receiver/src/
RUN     cd /opt/wirelesstags-receiver && npm install && npm run build

WORKDIR /opt/wirelesstags-receiver
CMD node build/server.js

EXPOSE 8080
