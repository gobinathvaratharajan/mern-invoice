ARG NODE_VERSION=20-alpine3.21
FROM node:${NODE_VERSION}

ARG APP_HOME=/app
WORKDIR $APP_HOME
RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml ./
RUN pnpm install


COPY . $APP_HOME
CMD ["pnpm", "run", "dev"]