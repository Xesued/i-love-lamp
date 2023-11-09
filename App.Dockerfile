FROM node:20-alpine as build

# Building with docker, we need to look for some local 
# files differently.
ENV DOCKER_BUILD=true

WORKDIR /app
COPY app/package.json ./
RUN npm i
COPY app/. ./
RUN npm run build

FROM nginx
COPY app/config/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

