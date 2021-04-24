FROM arm32v7/node:lts-alpine3.10

ADD ./build /

RUN cd /app && ls -lah && npm i

CMD ["node", "/app/src/index.js"]
