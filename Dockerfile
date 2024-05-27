# First image to compile typescript to javascript
FROM node:18.19.1-alpine AS build-image
WORKDIR /code
COPY . .
RUN npm install
RUN npm run build

# Second image, that creates an image for production
FROM node:18.19.1-alpine AS prod-image
WORKDIR /code
COPY --from=build-image ./code/dist ./dist
COPY package* ./
COPY ./admin ./admin
RUN npm install --production

CMD [ "node", "./dist/src/index.js" ]
