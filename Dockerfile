FROM node:24-alpine AS builder
WORKDIR /app

ENV PORT=3333
ENV HOST=0.0.0.0
ENV LOG_LEVEL=info
ENV APP_KEY=build-time-app-key-32-chars-minimum
ENV APP_URL=http://localhost:3333
ENV SESSION_DRIVER=cookie
ENV GATEWAY_1_URL=http://gateway1:3001
ENV GATEWAY_2_URL=http://gateway2:3001
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_USER=root
ENV DB_PASSWORD=root
ENV DB_DATABASE=gateway_sample
ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY . .
RUN node ace docs:generate
RUN node ace build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/build ./
COPY --from=builder /app/swagger.json /app/swagger.json

RUN npm install --omit=dev && npm cache clean --force
RUN addgroup -S adonis && adduser -S adonis -G adonis && chown -R adonis:adonis /app

USER adonis
EXPOSE 3333
CMD ["sh", "-c", "node ace migration:run --force && node bin/server.js"]