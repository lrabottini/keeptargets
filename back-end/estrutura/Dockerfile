FROM node:latest

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

EXPOSE 4000

CMD ["node", "src/index.js"]