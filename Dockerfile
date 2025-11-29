FROM oven/bun:1.2.21-debian AS build

WORKDIR /app

COPY bun.lockb package.json ./

RUN bun pm cache clean \
    && bun install --frozen-lockfile --verbose

COPY . .

ENV NODE_ENV=production

RUN bun build --compile --minify --sourcemap ./src --outfile app-name

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["/app/entrypoint.sh"]