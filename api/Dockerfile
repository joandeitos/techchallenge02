FROM node:18 #-alpine deu erro no ci/cd

# Criar diretório da aplicação
WORKDIR /usr/src/app

# ARG MONG_URI

# Copiar arquivos de dependências
COPY . .


# Remove dependencias para reinstalar
RUN rm -rf node_modules

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
