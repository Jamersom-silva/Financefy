FROM node:20

WORKDIR /app

# Copiar dependências
COPY package*.json ./

# Instalar
RUN npm install

# Copiar resto do projeto
COPY . .

# Porta do Vite
EXPOSE 5173

CMD ["npm", "run", "dev"]