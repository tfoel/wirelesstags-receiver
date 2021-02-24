FROM node:14-alpine3.13

RUN     mkdir -p /opt/wirelesstags-receiver/
ADD     * /opt/wirelesstags-receiver/
ADD     src /opt/wirelesstags-receiver/src/
RUN     cd /opt/wirelesstags-receiver && npm install

WORKDIR /opt/wirelesstags-receiver
CMD node src/server.mjs

EXPOSE 8080
