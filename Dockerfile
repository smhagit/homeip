FROM arm64v8/node:lts-alpine3.10

ADD ./build /

RUN cd /app && ls -lah && npm i

CMD ["node", "/app/src/index.js"]
