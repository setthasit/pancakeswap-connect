FROM node:14.17.0 AS builder
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
RUN npm install

FROM builder
COPY . .
RUN npm run build
CMD [ "npm", "run", "start:prod" ]