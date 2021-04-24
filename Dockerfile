FROM node:lts-alpine

ADD ./build /

RUN cd /app && ls -lah && npm i

CMD ["node", "/app/src/index.js"]
