# First image to compile typescript to javascript
FROM node:18.10-alpine AS build-image
WORKDIR /code
COPY . .
RUN npm ci
RUN npm run clean
RUN npm run build

# Second image, that creates an image for production
FROM nikolaik/python-nodejs:python3.9-nodejs16-alpine AS prod-image
WORKDIR /code
COPY --from=build-image ./code/dist ./dist
COPY package* ./
COPY ./resource ./resource
COPY ./admin ./admin
RUN npm ci --production
RUN pip3 install -r resource/py/requirements.txt

CMD [ "node", "./dist/src/index.js" ]
