# ---- build stage ----------------------------------------------------------
FROM node:24.11.1-slim AS build
WORKDIR /app

# npm ci (not install) so the build is reproducible from the lockfile.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Metro inlines EXPO_PUBLIC_* values into the bundle at BUILD time, so this has to be a
# build arg — setting it in the runtime environment has no effect on an already-exported
# bundle. Changing it requires `docker compose build frontend`.
ARG EXPO_PUBLIC_API_URL=http://localhost:8080/api/v1
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

RUN npx expo export --platform web --output-dir dist

# ---- runtime stage --------------------------------------------------------
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
