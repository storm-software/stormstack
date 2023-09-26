FROM node:latest AS node_base
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

# Install dependencies only when needed
FROM node_base AS web_deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
WORKDIR /src

# Install dependencies based on the preferred package manager
ENV NX_DAEMON=false
ENV CI=true

COPY package.json /src
COPY package-lock.json /src
RUN npm install --legacy-peer-deps

# Rebuild the source code only when needed
FROM node_base AS web_dist

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

RUN chown -R nextjs:nodejs /app
RUN chmod 755 /app

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs
# COPY --from=web_deps --chown=nextjs:nodejs /src .
# COPY --chown=nextjs:nodejs . .

COPY --from=web_deps --chown=nextjs:nodejs /src .
COPY --chown=nextjs:nodejs . .

USER nextjs

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

ENV NX_DAEMON=false
ENV CI=true

RUN npx nx build tools-executors-typescript --configuration=design-tokens-build --verbose

# Run design tokens build prior to linting so tailwindcss is configured
RUN npx nx build design-system-tokens --configuration=impact

RUN npx nx run web-shell:build:production

# Production image, copy all the files and run next
# FROM web_dist AS web_run
# WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=web_build /app/apps/web/shell/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=web_build --chown=nextjs:nodejs . .

EXPOSE 4200

ENV PORT 4200

CMD ["npx", "nx", "run", "web-shell:serve:production"]
