FROM node:alpine

WORKDIR /server
COPY package.json ./
COPY package-lock.json ./

RUN npm install --save sqlite3

COPY ./ ./

RUN npm install
EXPOSE 3001
CMD ["npm", "run", "start"]