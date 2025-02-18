FROM node:20-slim as builder

WORKDIR /var/www

COPY . .

RUN yarn install --non-interactive && \
	yarn build && \
	yarn install --production --prefer-offline --force --non-interactive

FROM node:20-slim as server

RUN yarn global add serve
WORKDIR /var/www
COPY --from=builder /var/www/dist .

CMD [ "serve", "-s", "dist" ]
