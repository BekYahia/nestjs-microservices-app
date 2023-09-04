FROM node:20-alpine AS development
WORKDIR /usr/src/app

RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml tsconfig.json nest-cli.json ./

RUN pnpm i

COPY libs libs
COPY apps/gateway apps/gateway

RUN pnpm run build gateway

# New stage for production
FROM node:20-alpine as production
WORKDIR /usr/src/app

ENV NODE_ENV=production
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --prod

COPY --from=development /usr/src/apps/dist ./dist

CMD ["node", "dist/apps/gateway/main"]