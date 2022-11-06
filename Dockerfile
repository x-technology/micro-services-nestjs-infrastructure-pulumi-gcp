FROM node:16.18.0 as builder

RUN apt update && \
  apt install -y protobuf-compiler

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json turbo.json ./

COPY packages ./packages

# Install workspace dependencies
RUN npm install

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "packages/dist/main.js" ]
