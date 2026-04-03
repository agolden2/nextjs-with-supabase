FROM node:24-slim AS builder
WORKDIR /app

RUN corepack enable pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY tsconfig.base.json ./
COPY packages/ packages/
COPY server/ server/
COPY ui/ ui/
COPY cli/ cli/

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:24-slim
WORKDIR /app

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/ui/dist ./ui/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3100
EXPOSE 3100

CMD ["node", "server/dist/index.js"]
