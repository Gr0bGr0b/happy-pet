# ---- deps -----------------------------------------------------------------
# npm ci (not install) so the build is reproducible from the lockfile. Split out
# from the source copy so editing a component does not reinstall the tree.
FROM node:24.11.1-slim AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---- dev ------------------------------------------------------------------
# Metro dev server, web target only. Source is bind-mounted over /app by the
# dev profile; node_modules stays in an anonymous volume so the host's install
# does not shadow this one.
FROM deps AS dev
WORKDIR /app
ENV NODE_ENV=development

# Not CI=1: Metro reads it as a non-interactive build and turns watch mode off.

COPY . .

EXPOSE 3000

CMD ["npx", "expo", "start", "--web", "--port", "3000"]

# ---- build ----------------------------------------------------------------
FROM deps AS build
WORKDIR /app

COPY . .

# Metro inlines EXPO_PUBLIC_* values into the bundle at BUILD time, so this has to be a
# build arg — setting it in the runtime environment has no effect on an already-exported
# bundle. Changing it requires `docker compose build frontend`.
ARG EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

RUN npx expo export --platform web --output-dir dist

# ---- runtime --------------------------------------------------------------
FROM node:24.11.1-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN npm install --global serve@14

COPY --from=build /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q --spider http://localhost:3000/ || exit 1

# Deliberately not `serve -s`: the export is statically rendered per route
# (cat/edit.html), and single-page mode would rewrite every path to index.html.
CMD ["serve", "dist", "-l", "3000"]
