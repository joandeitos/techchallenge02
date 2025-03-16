# Build stage
FROM node:18 as builder

# Criar diretório da aplicação
WORKDIR /usr/src/app

# ARG MONG_URI

# Copiar arquivos de dependências primeiro (para aproveitar o cache do Docker)
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas as dependências (incluindo as de desenvolvimento)
RUN npm install

# Copiar código fonte
COPY . .

# Buildar a aplicação
RUN npm run build

# Production stage
FROM node:18-slim

# Criar diretório da aplicação
WORKDIR /usr/src/app

# Copiar arquivos necessários do stage de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Instalar apenas dependências de produção
RUN npm install --production

# Expor porta
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
