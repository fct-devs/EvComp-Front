FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia código-fonte e faz o build
COPY . .
ARG API_URL
ENV API_URL=$API_URL
RUN npm run build

# Imagem final para rodar o app
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copia do builder os arquivos essenciais
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
