ARG NODE_VERSION=20-alpine3.21
FROM node:${NODE_VERSION}
LABEL name="mern-invoice"
LABEL license="MIT"
LABEL maintainer="Gobinath Varatharajan"

ENV NODE_ENV=development

ARG APP_HOME=/app
WORKDIR $APP_HOME
RUN addgroup -S invoice && adduser -S invoice -G invoice
RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml ./
RUN pnpm install


COPY --chown=invoice:invoice . $APP_HOME
RUN chown -R invoice:invoice $APP_HOME

USER invoice
EXPOSE 8000
CMD ["pnpm", "run", "dev"]