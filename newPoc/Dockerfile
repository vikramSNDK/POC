FROM node:23.6.0 AS build 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /usr/src/app/dist/new-poc/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx","-g","daemon off;"]