FROM node:20-alpine AS base

# -------------------------
# Install dependencies
# -------------------------
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
# Using npm to avoid bun extraction issues
RUN npm install --frozen-lockfile

# -------------------------
# Build application
# -------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Perform the build
RUN npm run build

# -------------------------
# Production image
# -------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy only necessary files for standalone
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
