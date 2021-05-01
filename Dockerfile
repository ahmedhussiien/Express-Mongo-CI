FROM node:15.14-alpine3.13

WORKDIR /app

COPY package*.json ./

RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]