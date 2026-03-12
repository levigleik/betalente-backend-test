FROM node:24-alpine AS builder
WORKDIR /app

ARG PORT=3333
ARG HOST=0.0.0.0
ARG LOG_LEVEL=info
ARG APP_KEY=build-time-app-key-32-chars-minimum
ARG APP_URL=http://localhost:3333
ARG SESSION_DRIVER=cookie
ARG GATEWAY_1_URL=http://gateway1:3001
ARG GATEWAY_2_URL=http://gateway2:3001
ARG DB_HOST=localhost
ARG DB_PORT=3306
ARG DB_USER=root
ARG DB_PASSWORD=root
ARG DB_DATABASE=gateway_sample
ARG ADMIN_NAME="John Doe Adm"
ARG ADMIN_EMAIL=john@example.com
ARG ADMIN_PASSWORD="S3cur3P4s5word!"
ARG NODE_ENV=development

ENV PORT=$PORT \
	HOST=$HOST \
	LOG_LEVEL=$LOG_LEVEL \
	APP_KEY=$APP_KEY \
	APP_URL=$APP_URL \
	SESSION_DRIVER=$SESSION_DRIVER \
	GATEWAY_1_URL=$GATEWAY_1_URL \
	GATEWAY_2_URL=$GATEWAY_2_URL \
	DB_HOST=$DB_HOST \
	DB_PORT=$DB_PORT \
	DB_USER=$DB_USER \
	DB_PASSWORD=$DB_PASSWORD \
	DB_DATABASE=$DB_DATABASE \
	ADMIN_NAME=$ADMIN_NAME \
	ADMIN_EMAIL=$ADMIN_EMAIL \
	ADMIN_PASSWORD=$ADMIN_PASSWORD \
	NODE_ENV=$NODE_ENV

COPY package*.json ./
RUN npm install

COPY . .
RUN node ace docs:generate
RUN node ace build

FROM node:24-alpine AS runner
WORKDIR /app

ARG PORT=3333
ARG HOST=0.0.0.0
ARG LOG_LEVEL=info
ARG APP_KEY=build-time-app-key-32-chars-minimum
ARG APP_URL=http://localhost:3333
ARG SESSION_DRIVER=cookie
ARG GATEWAY_1_URL=http://gateway1:3001
ARG GATEWAY_2_URL=http://gateway2:3001
ARG DB_HOST=localhost
ARG DB_PORT=3306
ARG DB_USER=root
ARG DB_PASSWORD=root
ARG DB_DATABASE=gateway_sample
ARG ADMIN_NAME="John Doe Adm"
ARG ADMIN_EMAIL=john@example.com
ARG ADMIN_PASSWORD="S3cur3P4s5word!"
ARG NODE_ENV=production

ENV PORT=$PORT \
	HOST=$HOST \
	LOG_LEVEL=$LOG_LEVEL \
	APP_KEY=$APP_KEY \
	APP_URL=$APP_URL \
	SESSION_DRIVER=$SESSION_DRIVER \
	GATEWAY_1_URL=$GATEWAY_1_URL \
	GATEWAY_2_URL=$GATEWAY_2_URL \
	DB_HOST=$DB_HOST \
	DB_PORT=$DB_PORT \
	DB_USER=$DB_USER \
	DB_PASSWORD=$DB_PASSWORD \
	DB_DATABASE=$DB_DATABASE \
	ADMIN_NAME=$ADMIN_NAME \
	ADMIN_EMAIL=$ADMIN_EMAIL \
	ADMIN_PASSWORD=$ADMIN_PASSWORD \
	NODE_ENV=$NODE_ENV

COPY --from=builder /app/build ./
COPY --from=builder /app/swagger.json /app/swagger.json

RUN npm install --omit=dev && npm cache clean --force
RUN addgroup -S adonis && adduser -S adonis -G adonis && chown -R adonis:adonis /app

USER adonis
EXPOSE 3333
CMD ["sh", "-c", "node ace migration:run --force && node ace db:seed && node bin/server.js"]
