# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG NEXT_PUBLIC_MKP_ADDRESS
ARG NEXT_PUBLIC_ERC20_ADDRESS
ARG BACKEND_URL
ARG PINATA_URL
ARG NEXT_PUBLIC_JWT_PINATA

ENV NEXT_PUBLIC_MKP_ADDRESS=$NEXT_PUBLIC_MKP_ADDRESS
ENV NEXT_PUBLIC_ERC20_ADDRESS=$NEXT_PUBLIC_ERC20_ADDRESS
ENV BACKEND_URL=$BACKEND_URL
ENV PINATA_URL=$PINATA_URL
ENV NEXT_PUBLIC_JWT_PINATA=$NEXT_PUBLIC_JWT_PINATA
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]