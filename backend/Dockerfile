FROM node:18

WORKDIR /app

COPY package.json .

RUN npm install
RUN mkdir uploads

COPY . .

EXPOSE 3000

CMD ["node","server.js"]