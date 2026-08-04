# ── Stage 1: build static site ───────────────────────────────────────────────
FROM node:22-alpine AS build

RUN corepack enable && corepack prepare pnpm@11.4.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY index.html vite.config.ts tsconfig.json ./
COPY src ./src
COPY imports ./imports
COPY .figma ./.figma

RUN pnpm build

# ── Stage 2: Caddy serves dist + reverse-proxies /api ────────────────────────
FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
