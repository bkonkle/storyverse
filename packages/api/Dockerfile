FROM node:12-alpine

WORKDIR /usr/src/app

RUN apk add --update curl git python build-base

COPY package.json .
COPY yarn.lock .
RUN yarn config set registry https://registry.npmjs.org \
  && yarn --frozen-lockfile --ignore-scripts --prefer-offline

COPY . .

RUN yarn build


FROM node:12-alpine
ARG NODE_ENV
ARG DUMB_INIT=1.2.2
EXPOSE 4000
EXPOSE 9229

WORKDIR /usr/src/app

ADD https://github.com/Yelp/dumb-init/releases/download/v${DUMB_INIT}/dumb-init_${DUMB_INIT}_amd64 /usr/local/bin/dumb-init

RUN chmod +x /usr/local/bin/dumb-init && \
  mkdir -p /usr/src/app && \
  chown -R node /usr/src/app

COPY --chown=node --from=0 /usr/src/app .

USER node

ENTRYPOINT ["dumb-init", "--"]

CMD ["sh", "-c", "yarn start"]
