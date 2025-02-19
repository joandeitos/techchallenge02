# Estágio de build
FROM node:18-alpine as build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração e dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código-fonte
COPY . .

# Configurar variáveis de ambiente para build
ENV VITE_API_URL=http://localhost:3000/api

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos de build do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"]