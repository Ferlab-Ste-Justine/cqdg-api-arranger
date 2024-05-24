# First image to compile typescript to javascript
FROM node:18.10-alpine AS build-image
WORKDIR /code
COPY . .
RUN npm install
RUN npm run clean
RUN npm run build

# Second image, that creates an image for production
FROM node:18.10-alpine AS prod-image
WORKDIR /code
COPY --from=build-image ./code/dist ./dist
COPY package* ./
COPY ./admin ./admin
RUN npm install --production

CMD [ "node", "./dist/src/index.js" ]
